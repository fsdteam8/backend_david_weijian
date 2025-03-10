import { Auth } from "../model/auth.model.js"
import {generateAccessAndRefreshToken} from "../controller/auth.controller.js"

// Supervisor Login
const supervisorLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await Auth.findOne({ email, who: "supervisor" }); 
    if (!user) {
      return res.status(404).json({status: false, message: "Supervisor not found" });
    }

    const isPasswordValid = await user.isPasswordValid(password);
    if (!isPasswordValid) {
      return res.status(401).json({status: false, message: "Invalid credentials" });
    }

    const { accessToken } = await generateAccessAndRefreshToken(user._id);

    await user.save();

    res.status(200).json({
      status: true,
      message: "Supervisor login successful",
      accessToken,
    });
  } catch (error) {
    console.log("Error while login as supervisor", error);
    res.status(500).json({status: false, message: "Server error", error: error.message });
  }
};

// <<<<<<<<<<<<<<<<<<<< ALL USERS >>>>>>>>>>>>>>>>>>>>>>>>>>>>
const getAllUsersForSupervisor = async (_, res) => {
  try {
    const users = await Auth.find().select("-password -refreshToken");

    if (!users) {
      return res.status(404).json({ status: false, message: 'No users found' });
    }

    return res.status(200).json({
      status: true,
      message: 'Users fetched successfully for supervisor',
      data: users
    });
  } catch (error) {
    console.log("Error getting users from supervisor", error);
    return res.status(500).json({ status: false, message: error.message });
  }
};

export { getAllUsersForSupervisor, supervisorLogin };
