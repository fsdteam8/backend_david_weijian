import { Auth } from "../model/auth.model.js"

// Get all users (Supervisor can view, but not update or delete)
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

export { getAllUsersForSupervisor };
