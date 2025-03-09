import { Auth } from "../model/auth.model.js";
import { ContactUs } from "../model/contactUs.model.js";

// Get all users (Admin only)
const getAllUsers = async (req, res) => {
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

// Get all users contactUs data from admin
const getAllContactUsSubmissions = async (_, res) => {
  try {
    const contactSubmissions = await ContactUs.find().populate(
      "user",
      "name email"
    ).lean()


    if (!contactSubmissions) {
      return res.status(404).json({ status: false, message: "No data found" });
    }

    return res.status(200).json({
      status: true,
      message: "Contact us data fetched successfully",
      data: contactSubmissions,
    });
  } catch (error) {
    return res.status(500).json({status:false, message: error.message });
  }
};

// Update user role (Admin only)
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

// Delete user (Admin only)
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

export { getAllUsers, updateUserRole, deleteUser, getAllContactUsSubmissions };
