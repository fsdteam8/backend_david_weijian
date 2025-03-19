import {Auth} from "../model/auth.model.js";
import { generateAccessAndRefreshToken } from "../controller/auth.controller.js";

// Google 0Auth success
const googleAuthSuccess = async (req, res) => {
  try {
    if (!req.user) {
      return res
        .status(401)
        .json({ status: false, message: "Google Authentication failed" });
    }

    const userId = req.user._id;

    // Generate Access and Refresh Tokens
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      userId
    );
    // Save the data
    let authData = await Auth.findOne({ user: userId });

    if (authData) {
      authData.refreshToken = refreshToken;
      await authData.save();
    } else {
      await Auth.create({ user: userId, refreshToken }); 
    }

    res.setHeader("Authorization", `Bearer ${accessToken}`);

    return res.redirect(
      `http://localhost:3000/auth-success?accessToken=${accessToken}&refreshToken=${refreshToken}`
    );
  } catch (error) {
    console.error("Google OAuth Error:", error);
    return res
      .status(500)
      .json({ status: false, message: "Internal Server Error" });
  }
};

// Google 0Auth failure
const googleAuthFailure = (_, res) => {
  return res.status(401).json({status: false, message: "Google Authentication failed" });
};

// Logout user
const logout = (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({status: false, message: "Logout failed" });
    return res.json({status: true, message: "Logged out successfully" });
  });
};
export { googleAuthSuccess, googleAuthFailure, logout };
