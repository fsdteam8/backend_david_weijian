import { Auth } from "../model/auth.model.js";
import { sendOTP } from "../util/email.util.js";
import { generateOTP } from "../util/otp.util.js";
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
    if ([name, email, password, dateOfBirth].some((field) => field?.trim() === "")) {
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
    const createdUser = await Auth.findById(user._id).select("-password -refreshToken");

    return res.status(201).json({
      status: true,
      message: "User created successfully",
      data: createdUser,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

// login user
const userLogin = async (req, res) => {
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
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

  // again remove password and refreshToken field from response
  const loggedUser = await Auth.findById(user._id).select("-password -refreshToken");

  // set the access token in the response header
  res.setHeader('Authorization', `Bearer ${accessToken}`);

  // return the user data and refresh token
  return res.status(200).json({
    status: true,
    message: "User logged in successfully",
    data: loggedUser,
    refreshToken,
    accessToken,
  });
};

// logout user
const userLogout = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(400).json({ status: false, message: "User not found." });
    }

    // Remove refreshToken from the database (user logout)
    await Auth.findByIdAndUpdate(user._id, { refreshToken: null });

    return res.status(200).json({ status: true, message: "Logged out successfully" });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};


// Refresh token endpoint
const refreshAccessToken = async (req, res) => {
  const { refreshToken } = req.body; 

  if (!refreshToken) {
    return res.status(500).json({ status: false, message: "Refresh token not provided." });
  }

  const user = await Auth.findOne({ refreshToken });
  if (!user) {
    return res.status(403).json({ status: false, message: "Invalid refresh token." });
  }

  try {
    const decodedToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

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
    const { accessToken, newRefreshToken } = await generateAccessAndRefreshToken(user._id);

    res.setHeader('Authorization', `Bearer ${accessToken}`); 

    return res.status(200).json({
      status: true,
      message: "Access token refreshed successfully",
      accessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};


export { userRegister, userLogin, userLogout, refreshAccessToken };
