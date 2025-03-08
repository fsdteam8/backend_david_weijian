import { Auth } from "../model/auth.model.js";
import { UserProfile } from "../model/userProfile.model.js";

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
    console.error("Error get authModel data in user profile: ",error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Update User Profile (name, email, phone, dateOfBirth)
// const updateUserProfile = async (req, res) => {
//   try {
//     const { name, email, phone, dateOfBirth } = req.body; 
//     const userId = req.user._id; 

//     l
//     const user = await Auth.findById(userId);
//     if (!user) {
//       return res.status(404).json({status:false, message: 'User not found' });
//     }

//     // Check if the user already has a profile
//     let userProfile = await UserProfile.findOne({ user: userId });
//     if (!userProfile) {
//       return res.status(404).json({status:false, message: 'User profile not found' });
//     }

//     let updatedFields = false;

//     // Update fields individually
//     if (name) {
//       userProfile.name = name;
//       user.name = name;
//       updatedFields = true;
//     }

//     if (email) {
//       userProfile.email = email;
//       user.email = email; 
//       updatedFields = true;
//     }

//     if (phone) {
//       if (!userProfile.phone) {
//         userProfile.phone = phone; 
//       } else {
//         userProfile.phone = phone; 
//       }
//       updatedFields = true;
//     }

//     if (dateOfBirth) {
//       userProfile.dateOfBirth = dateOfBirth;
//       user.dateOfBirth = dateOfBirth;
//       updatedFields = true;
//     }

//     // If no fields were updated, return an error
//     if (!updatedFields) {
//       return res.status(400).json({status: false, message: 'No fields to update' });
//     }

//     // Set updateAt time forn current user
//     userProfile.updatedAt = new Date();
//     await userProfile.save();
//     await user.save();   

//     return res.status(200).json({
//         status: true,
//         message: 'User Profile updated successfully',
//         data: userProfile, 

//     }); 
//   } catch (error) {
//     console.error("Error while update profile",error);
//     res.status(500).json({status: false, message: error.message });
//   }
// };


export {
    getUserProfile,
}