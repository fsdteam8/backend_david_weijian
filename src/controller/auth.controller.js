import { Auth } from "../model/auth.model.js";
import { sendMail } from "../util/email.util.js";
import { generateOTP } from "../util/otp.util.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// generate token
const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await Auth.findById(userId);
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: true });

    return { accessToken, refreshToken };
  } catch (error) {
    return {
      status: false,
      message: error.message,
    };
  }
};

// register user
const userRegister = async (req, res) => {
  try {
    const { name, email, password, dateOfBirth } = req.body;

    // check the body is empty or not
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        status: false,
        message: "Request body is empty.",
      });
    }

    // check the fields are filled or not
    if (
      [name, email, password, dateOfBirth].some((field) => field?.trim() === "")
    ) {
      return res.status(400).json({
        status: false,
        message: "All fields are required.",
      });
    }

    // check email format
    if (!email || !email.includes("@") || !email.includes(".")) {
      return res.status(400).json({
        status: false,
        message: "Invalid email format.",
      });
    }

    // check if user already exists
    const existedUser = await Auth.findOne({ $or: [{ email }, { name }] });

    if (existedUser) {
      return res.status(400).json({
        status: false,
        message: "User with this email or name already exists.",
      });
    }

    // create new user
    const user = await Auth.create({ name, email, password, dateOfBirth });

    // remove password and refreshToken field from response
    const createdUser = await Auth.findById(user._id).select(
      "-password -refreshToken"
    );

    return res.status(201).json({
      status: true,
      message: "User created successfully",
      data: createdUser,
    });
  } catch (error) {
    console.error("Error while registering a user:", error);
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

// login user
const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: false,
        message: "Email and password are required.",
      });
    }

    const user = await Auth.findOne({ email });

    // if user not found then throw error
    if (!user) {
      return res.status(400).json({
        status: false,
        message: "User not found.",
      });
    }

    // compare the password
    const isPasswordCorrect = await user.isPasswordValid(password);
    if (!isPasswordCorrect) {
      return res.status(400).json({
        status: false,
        message: "Incorrect password.",
      });
    }

    // implement access and refresh token
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      user._id
    );

    // again remove password and refreshToken field from response
    const loggedUser = await Auth.findById(user._id).select(
      "-password -refreshToken"
    );

    // set the access token in the response header
    res.setHeader("Authorization", `Bearer ${accessToken}`);

    // return the user data and refresh token
    return res.status(200).json({
      status: true,
      message: "User logged in successfully",
      data: loggedUser,
      refreshToken,
      accessToken,
    });
  } catch (error) {
    console.error("Error while login:", error);
    return res.status(400).json({
      status: false,
      message: error.message,
    });
  }
};

// logout user
const userLogout = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res
        .status(400)
        .json({ status: false, message: "User not found." });
    }

    // Remove refreshToken from the database (user logout)
    await Auth.findByIdAndUpdate(user._id, { refreshToken: null });

    return res
      .status(200)
      .json({ status: true, message: "Logged out successfully" });
  } catch (error) {
    console.error("Error while logout: ", error);
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

// Refresh accessToken
const refreshAccessToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res
      .status(500)
      .json({ status: false, message: "Refresh token not provided." });
  }

  const user = await Auth.findOne({ refreshToken });
  if (!user) {
    return res
      .status(403)
      .json({ status: false, message: "Invalid refresh token." });
  }

  try {
    const decodedToken = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await Auth.findById(decodedToken?._id);

    // check if user is not available then throw error
    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    // Matching refreshToken with user refreshToken
    if (user.refreshToken !== refreshToken) {
      throw new ApiError(401, "Refrsh token is expired or used");
    }

    // If the token is valid, generate a new access token and set the header
    const { accessToken, newRefreshToken } =
      await generateAccessAndRefreshToken(user._id);

    res.setHeader("Authorization", `Bearer ${accessToken}`);

    return res.status(200).json({
      status: true,
      message: "Access token refreshed successfully",
      accessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    console.error("Error in refresh access token:", error);
    return res.status(500).json({ status: false, message: error.message });
  }
};

// forgot password
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res
        .status(400)
        .json({ status: false, message: "Email is required" });
    }

    // Find user by email
    const user = await Auth.findOne({ email });
    if (!user) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    // Generate a random 6-digit otp
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    // set the otp in database
    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    // Send the OTP to the users
    await sendMail(email, otp);

    return res.status(201).json({
      status: true,
      message: "Your OTP has been sent",
    });
  } catch (error) {
    console.error("Error in forgotPassword:", error);
    return res.status(500).json({ status: false, message: error.message });
  }
};

// Verify the otp
const verifyOtp = async (req, res) => {
  try {
    const {otp } = req.body;

    // check the user and the otp is inalid or expire
    const user = await Auth.findOne({ otp });
    if (user.otp !== otp || new Date() > user.otpExpires) {
      return res.status(400).json({status: false, message: "Invalid or expired OTP" });
    }

    // If verified then undefine otp details from database
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    return res.json({ status: true, message: "OTP verified successfully" });
  } catch (error) {
    console.log("Error in verifyOtp:", error);
    return res.status(500).json({ status: false, message: error.message });
  }
};

// Resend otp
const resendOTP = async (req, res) => {
  try {
    const { otp } = req.body;

    // Find the user by otp
    const user = await Auth.findOne({ otp });
    if (!user)
      return res.status(404).json({ status: false, message: "User not found or OTP is incorrect" });

    // Generate new otp
    const newOtp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    // Update the otp
    user.otp = newOtp;
    user.otpExpires = otpExpires;
    await user.save();

    // Send otp users email
    await sendMail(user.email, newOtp); 

    return res.status(200).json({
      status: true,
      message: "OTP has been resent successfully",
    });
  } catch (error) {
    console.log("Error while sending new otp: ", error);
    return res.status(500).json({ status: false, message: error.message });
  }
};



// const resetPassword = async (req, res) => {
//   try {
//     const { email, newPassword } = req.body;

//     const user = await User.findOne({ email });
//     if (!user) return res.status(404).json({ message: "User not found" });

//     const hashedPassword = await bcrypt.hash(newPassword, 10);
//     user.password = hashedPassword;
//     await user.save();

//     res.json({ message: "Password reset successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error });
//   }
// };

export {
  userRegister,
  userLogin,
  userLogout,
  refreshAccessToken,
  forgotPassword,
  verifyOtp,
  resendOTP
};
