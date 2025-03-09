import { Auth } from "../model/auth.model.js"

// Get all users (Admin only)
const getAllUsers = async (req, res) => {
  try {
    const users = await Auth.find().select("-password -refreshToken");

    if (!users) {
      return res.status(404).json({ status: false, message: 'No users found' });
    }
    
    return res.status(200).json({
      status: true,
      message: 'Users fetched successfully',
      data: users
    });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};




export { getAllUsers, updateUserRole, deleteUser };
