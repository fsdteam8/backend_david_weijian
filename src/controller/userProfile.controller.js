import { Auth } from "../model/auth.model.js";
import { UserProfile } from "../model/userProfile.model.js";
import { uploadOnCloudinary } from "../util/cloudinary.util.js";
import { deleteFromCloudinary } from "../util/cloudinaryDestroy.util.js";

// Get user profile
const getUserProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await Auth.findById(userId);
    if (!user) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    let userProfile = await UserProfile.findOne({ user: userId });

    if (!userProfile) {
      // If not profile then add the AuthModel data in user profile
      userProfile = new UserProfile({
        user: userId,
        name: user.name,
        email: user.email,
        phone: "",
        dateOfBirth: user.dateOfBirth,
      });

      //   save the profile
      await userProfile.save();
    }

    return res.status(200).json({
      status: true,
      message: "User Profile fetched successfully",
      data: userProfile,
    });
  } catch (error) {
    console.error("Error get authModel data in user profile: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Update User Profile and upload avatar and also update avatar
const updateUserProfile = async (req, res) => {
  try {
    const { name, email, phone, dateOfBirth } = req.body;
    const userId = req.user._id;

    // Find the user's profile
    let userProfile = await UserProfile.findOne({ user: userId });

    if (!userProfile) {
      return res.status(404).json({ message: "User profile not found" });
    }

    // Handle avatar upload
    if (req.file) {
      const filePath = req.file.path;

      // Upload new avatar to Cloudinary
      const cloudinaryResponse = await uploadOnCloudinary(filePath);
      if (!cloudinaryResponse) {
        return res
          .status(500)
          .json({ message: "Failed to upload image to Cloudinary" });
      }

      // Delete the old avatar
      if (userProfile.avatar) {
        const publicId = userProfile.avatar.split("/").pop().split(".")[0];
        await deleteFromCloudinary(publicId);
      }

      // Update user profile with avatar URL
      userProfile.avatar = cloudinaryResponse.url;
    }

    // Update other user profile fields
    userProfile.name = name || userProfile.name;
    userProfile.email = email || userProfile.email;
    userProfile.phone = phone || userProfile.phone;
    userProfile.dateOfBirth = dateOfBirth || userProfile.dateOfBirth;
    userProfile.updatedAt = new Date();

    // Save updated profile
    await userProfile.save();

    return res.status(200).json({
      status: true,
      message: "Profile updated successfully",
      userProfile,
    });
  } catch (error) {
    console.error("Error updating profile:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// change password from profile
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmNewPassword } = req.body;

    const userId = req.user._id;
    const user = await Auth.findById(userId);

    if (!user) {
      return res.status(404).json({
        status: false,
        message: "User not found",
      });
    }

    // check the pass
    const isMatch = await user.isPasswordValid(currentPassword);

    if (!isMatch) {
      return res.status(400).json({
        status: false,
        message: "Incorrect current password",
      });
    }

    // check if new password and confirm new password match
    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({
        status: false,
        message: "New password and confirm new password does not match",
      });
    }

    // update the password
    user.password = newPassword;
    await user.save();

    return res.status(200).json({
      status: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.log("Error while changing password: ", error);
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};
export { getUserProfile, updateUserProfile, changePassword };
