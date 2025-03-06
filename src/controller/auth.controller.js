import { User } from "../model/auth.model.js";
import jwt from "jsonwebtoken";

// generate token
const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findOne(userId);
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
    const existedUser = await User.findOne({
      $or: [{ email }, { name }],
    });
  
    if (existedUser) {
      return res.status(500).json({
        status: false,
        message: error.message,
      });
    }
  
  //   create new user
    const user = await User.create({
      name,
      email,
      password,
      dateOfBirth,
    });
  
  //   remove password and refreshToken field from response
  const createdUser = await User.findById(user._id).select("-password -refreshToken")
  
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

export { generateAccessAndRefreshToken, userRegister };
