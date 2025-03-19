import { Auth } from "../model/auth.model.js";
import { ContactUs } from "../model/contactUs.model.js";
import { BugReport } from "../model/bugReport.model.js";
import { generateAccessAndRefreshToken } from "../controller/auth.controller.js";
import { TestCentre } from "../model/testCentre.model.js";
import { Route } from "../model/routeCentre.model.js";

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

    const { accessToken } = await generateAccessAndRefreshToken(user._id);

    await user.save();

    res.setHeader("Authorization", `Bearer ${accessToken}`);

    return res.status(200).json({
      status: true,
      message: "Admin login successful",
      accessToken,
    });
  } catch (error) {
    console.log("Error while login in admin dashboard: ", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

// <<<<<<<<<<<<<<<<<<<<<<<< USER CONTROLLER FOR ADMIN >>>>>>>>>>>>>>>>>>>>>>>>>
// Get user
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

// Update role
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

// Devele user
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

// <<<<<<<<<<<<<<<<<<<<<<< TEST_CENTRE CONTROLLER FOR ADMIN >>>>>>>>>>>>>>>>>>>>
// Add test centre
const addTestCenter = async (req, res) => {
  const { name, passRate, routes, address, postCode } = req.body;

  try {

    const testCentre = await TestCentre.findOne({ name })

    if (testCentre) {
      return res.status(400).json({ status: false, message: "Test centre name already exists" })
    }
    const newTestCenter = new TestCentre({
      name,
      passRate,
      routes,
      address,
      postCode,
    });

    if (!newTestCenter) {
      return res
        .status(400)
        .json({ status: false, message: "You must fill up everything" });
    }
    await newTestCenter.save();

    return res.status(201).json({
      status: true,
      message: "Test centre added successfully",
      data: newTestCenter,
    });
  } catch (error) {
    console.log("Error while added test centre", error);
    return res.status(500).json({ status: false, message: error.message });
  }
};

// Update a Test Center
const updateTestCenter = async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;
    const updatedTestCenter = await TestCentre.findByIdAndUpdate(id, body, {
      new: true,
    });

    if (!updatedTestCenter) {
      return res
        .status(404)
        .json({ status: false, message: "Test centre not found" });
    }
    return res.status(200).json({
      status: true,
      message: "Test centre updated successfully",
      data: updatedTestCenter,
    });
  } catch (error) {
    console.log("Error while updating test centre", error);
    return res.status(500).json({ status: false, message: err.message });
  }
};

// Delete a Test Center
const deleteTestCenter = async (req, res) => {
  try {
    const user = await TestCentre.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ status: false, message: "User not found" });
    }
    return res
      .status(200)
      .json({ status: true, message: "Test center deleted" });
  } catch (error) {
    console.log("Error while deleting test center", error);
    return res.status(500).json({ status: false, message: err.message });
  }
};

// <<<<<<<<<<<<<<<<<<<<<<< ROUTE_CENTRE CONTROLLER FOR ADMIN >>>>>>>>>>>>>>>>>>>

// Create a new route
const createRoute = async (req, res) => {

  try {

    req.body.isUser = "admin"

    const route = new Route(req.body);
    if (!route) {
      return res.status(400).json({
        status: false,
        message: "You must provide all the route details",
      });
    }
    await route.save();

    return res.status(201).json({
      status: true,
      message: "Route created successfully",
      data: route,
    });
  } catch (error) {
    return res.status(400).json({ status: false, message: error.message });
  }
};

// // Update a route by ID
const updateRoute = async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;
    const route = await Route.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });
    if (!route) {
      return res
        .status(404)
        .json({ status: false, message: "Route not found" });
    }
    return res.status(200).json({
      status: true,
      message: "Route updated successfully",
      data: route,
    });
  } catch (error) {
    console.log("Error while updating routes", error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

// // Delete a route by ID
const deleteRoute = async (req, res) => {
  try {
    const { id } = req.params;
    const route = await Route.findByIdAndDelete(id);
    if (!route) {
      return res
        .status(404)
        .json({ status: false, message: "Route not found" });
    }
    return res.status(200).json({
      status: true,
      message: "Route deleted successfully",
    });
  } catch (error) {
    console.log("Error while deleting routes", error);
    return res.status(500).json({ status: false, message: error.message });
  }
};

// <<<<<<<<<<<<<<<<<<<<<<< REVIEW CONTROLLER FOR ADMIN >>>>>>>>>>>>>>>>>>>>>>>>>
const getAllReview = async (req, res) => {

  try {
    const reviews = await Route.find()
      .populate({
        path: "reviews.userId",
        select: "name email -_id",
      })
      .select("reviews routeName TestCentreName address");


    if (!reviews || reviews.length === 0) {
      return res.status(404).json({ status: false, message: "No data found" });
    }
    return res.status(200).json({
      status: true,
      message: "Review data fetched successfully",
      data: reviews,
    });
  } catch (error) {
    console.log("Error getting reviews", error);
    return res.status(500).json({ status: false, message: error.message });
  }
}
export {
  getAllUsers,
  updateUserRole,
  deleteUser,
  getAllContactUsSubmissions,
  getAllBugReports,
  adminLogin,
  addTestCenter,
  updateTestCenter,
  deleteTestCenter,
  createRoute,
  updateRoute,
  deleteRoute,
  getAllReview
};
