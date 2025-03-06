import { Auth } from "../model/auth.model.js";
import {sendOTP} from "../util/email.util.js"
import {generateOTP} from "../util/otp.util.js"
import jwt from "jsonwebtoken";

// generate token
const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await Auth.findOne(userId);
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: true });

    return { accessToken, refreshToken };
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

// register user
const userRegister = async (req, res) => {
  try {
    const { name, email, password, dateOfBirth } = req.body;
  
  //   check the body is empty or not
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(500).json({
        status: false,
        message: error.message,
      });
    }
  
  //   check the fields are filled or not
    if (
      [name, email, password, dateOfBirth].some((field) => field?.trim("") === "")
    ) {
      return res.status(500).json({
        status: false,
        message: error.message,
      });
    }
  
  //   check email format
    if (!email || !email.includes("@") || !email.includes(".")) {
      return res.status(500).json({
        status: false,
        message: error.message,
      });
    }
  
  //   check existed user
    const existedUser = await Auth.findOne({
      $or: [{ email }, { name }],
    });
  
    if (existedUser) {
      return res.status(500).json({
        status: false,
        message: error.message,
      });
    }
  
  //   create new user
    const user = await Auth.create({
      name,
      email,
      password,
      dateOfBirth,
    });
  
  //   remove password and refreshToken field from response
  const createdUser = await Auth.findById(user._id).select("-password -refreshToken")
  
  return res.status(201).json(
      {
          status: true,
          message: "User created successfully",
          data: createdUser
      }
  )
  } catch (error) {
    return res.status(500).json(
        {
            status: false,
            message: error.message
        }
    )
  }
};

// login user
const userLogin = async (req, res)=>{
  const {email, password} = req.body;

  if(!email || !password){
    return res.status(400).json({
      status: false,
      message: error.message
    });
  }

  const user = await Auth.findOne({
    $or: [{ email }, { password }],
  });

  // if user not found then throw error
  if (!user) {
    return res.status(400).json({
      status: false,
      message: error.message
    });
  }

  // compare the password
  const isPasswordCorrect = await user.isPasswordValid(password);
  if (!isPasswordCorrect) {
    return res.status(400).json({
      status: false,
      message: error.message
    });
  }

  // implement access and refresh token
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  // again remove password and refreshToken filed from response
  const loggedUser = await Auth.findById(user._id).select(
    "-password -refreshToken"
  );

  // set the access token in the response header
  res.setHeader('Authorization', `Bearer ${accessToken}`);

  // return the user data and refresh token
  return res.status(201).json(
    {
      status: true,
      message: "User logged in successfully",
      data: loggedUser,
      refreshToken
    }
  )
}

// Logout




export { userRegister, userLogin };
