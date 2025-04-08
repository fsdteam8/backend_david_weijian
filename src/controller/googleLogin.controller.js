import { OAuth2Client } from "google-auth-library";
import { Auth } from "../model/auth.model.js";
import { generateAccessAndRefreshToken } from "../controller/auth.controller.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleLogin = async (req, res) => {
  try {
    const { idToken } = req.body;
    if (!idToken) {
      return res.status(400).json({ status: false, message: "Missing idToken" });
    }

    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    const { sub: googleId, email, name, picture: avatar } = payload;

    let user = await Auth.findOne({ email });

    if (!user) {
      user = await Auth.create({
        name,
        email,
        password: "google_auth",
        dateOfBirth: new Date(),
        googleId,
        avatar,
        who: "user" // Add this if needed
      });
    } else if (!user.googleId) {
      // Update existing user with Google ID if not present
      user.googleId = googleId;
      await user.save();
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

    user.refreshToken = refreshToken;
    await user.save();

    return res.status(200).json({
      status: true,
      message: "Google Login Success",
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar
      }
    });
  } catch (error) {
    console.error("Google Login Error:", error);
    return res.status(500).json({ status: false, message: "Internal Server Error" });
  }
};

export const logout = async (req, res) => {
  try {
    const { userId } = req.body;

    await Auth.findByIdAndUpdate(userId, {
      $set: { refreshToken: null }
    });

    return res.status(200).json({
      status: true,
      message: "Logged out successfully"
    });
  } catch (error) {
    return res.status(500).json({ status: false, message: "Logout failed" });
  }
};