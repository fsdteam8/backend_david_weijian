import { Auth } from "../model/auth.model.js";
import { ContactUs } from "../model/contactUs.model.js";
import { BugReport } from "../model/bugReport.model.js";
import { generateAccessAndRefreshToken } from "../controller/auth.controller.js";

// Admin Login
const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await Auth.findOne({ email, who: "admin" });
    if (!user) {
      return res
        .status(404)
        .json({ status: false, message: "Admin not found" });
    }

    const isPasswordValid = await user.isPasswordValid(password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ status: false, message: "Password invalid" });
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      user._id
    );

    user.refreshToken = refreshToken;
    await user.save();

    res.setHeader("Authorization", `Bearer ${accessToken}`);

    return res.status(200).json({
      status: true,
      message: "Admin login successful",
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.log("Error while login in admin dashboard: ", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

// <<<<<<<<<<<<<<<<<<<<<<<< USER CONTROLLER FOR ADMIN >>>>>>>>>>>>>>>>>>>>>>>>>
const getAllUsers = async (_, res) => {
  try {
    const users = await Auth.find().select("-password -refreshToken");

    if (!users) {
      return res.status(404).json({ status: false, message: "No users found" });
    }

    return res.status(200).json({
      status: true,
      message: "Users fetched successfully",
      data: users,
    });
  } catch (error) {
    console.log("Error geting all users from admin: ", error);
    return res.status(500).json({ status: false, message: error.message });
  }
};

const updateUserRole = async (req, res) => {
  try {
    const { userId, role } = req.body;

    if (!["admin", "supervisor", "user"].includes(role)) {
      return res.status(400).json({ status: false, message: "Invalid role" });
    }

    const updatedUser = await Auth.findByIdAndUpdate(
      userId,
      { who: role },
      { new: true }
    ).select("-password -refreshToken");

    if (!updatedUser) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    return res.status(200).json({
      status: true,
      message: "User role updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.log("Error updating user from admin: ", error);
    return res.status(500).json({ status: false, message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { userId } = req.body;
    const deletedUser = await Auth.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    return res.status(200).json({
      status: true,
      message: "User deleted successfully",
      data: deletedUser,
    });
  } catch (error) {
    console.log("Error while deleting: ", error);
    return res.status(500).json({ status: false, message: error.message });
  }
};

// <<<<<<<<<<<<<<<<<<<<<<<< CONTACT_US CONTROLLER FOR ADMIN >>>>>>>>>>>>>>>>>>>
const getAllContactUsSubmissions = async (_, res) => {
  try {
    const contactSubmissions = await ContactUs.find()
      .populate("user", "name email")
      .lean();

    if (!contactSubmissions) {
      return res.status(404).json({ status: false, message: "No data found" });
    }

    return res.status(200).json({
      status: true,
      message: "Contact us data fetched successfully",
      data: contactSubmissions,
    });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};

// <<<<<<<<<<<<<<<<<<<<<<< BUG_REPORT CONTROLLER FOR ADMIN >>>>>>>>>>>>>>>>>>>>
const getAllBugReports = async (_, res) => {
  try {
    const bugReports = await BugReport.find()
      .populate("user", "name email")
      .lean();

    if (!bugReports) {
      return res.status(404).json({ status: false, message: "No data found" });
    }

    return res.status(200).json({
      status: true,
      message: "Bug report data fetched successfully",
      data: bugReports,
    });
  } catch (error) {
    console.log("Error getting bug reports", error);
    return res.status(500).json({ status: false, message: error.message });
  }
};
export {
  getAllUsers,
  updateUserRole,
  deleteUser,
  getAllContactUsSubmissions,
  getAllBugReports,
  adminLogin,
};
