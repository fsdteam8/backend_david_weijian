import { Route } from "../model/routeCentre.model.js";
import { TestCentre } from "../model/testCentre.model.js";
import mongoose from "mongoose";
// Get test centre details
const getTestCentreWithRoutes = async (req, res) => {
  try {
    const { id } = req.params;

    const testCentre = await TestCentre.findById(id);
    if (!testCentre) {
      return res
        .status(404)
        .json({ status: false, message: "Test centre not found" });
    }

    const routes = await Route.find({ testCentreId: id });

    return res.status(200).json({
      status: true,
      message: "Test centre and routes fetched successfully",
      data: routes,
    });
  } catch (error) {
    console.log("Error getting routes for test centre", error);
    return res.status(500).json({ status: false, message: error.message });
  }
};

// Get all routes
const getAllRoutes = async (req, res) => {

  try {

    const routes = await Route.find({ isUser: "user" })

    return res.status(200).json({
      status: true,
      data: routes
    })
  }

  catch (error) {
    return res.status(500).json({
      status: false,
      message: "Internal server error, please try again later"
    })
  }
};

const getAllRoutesOfUser = async (req, res) => {

  try {

    const routes = await Route.find({ isUser: "user", userId: req.user._id })

    return res.status(200).json({
      status: true,
      message: "Routes fetched successfully",
      data: routes
    })
  }

  catch (error) {
    return res.status(500).json({
      status: false,
      message: "Internal server error, please try again later"
    })
  }
}


const getARoute = async (req, res) => {

  const { id } = req.params;

  try {
    const route = await Route.findById(id);
    if (!route) {
      return res.status(404).json({ status: false, message: "Route not found" });
    }
    return res.status(200).json({
      status: true,
      data: route,
    });
  }

  catch (error) {
    console.log("Error getting route details", error);
    return res.status(500).json({ status: false, message: error.message });
  }
};

// Increment views for a route
const incrementViews = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the route and increment its views
    const route = await Route.findByIdAndUpdate(
      id,
      { $inc: { view: 1 } },
      { new: true }
    );

    if (!route) {
      return res.status(404).json({ status: false, message: "Route not found" });
    }

    return res.status(200).json({
      status: true,
      message: "Views incremented successfully",
      data: route,
    });
  } catch (error) {
    console.log("Error getting view details for route", error);
    res.status(500).json({ status: false, message: error.message });
  }
};

//  toggleFavorite
const toggleFavorite = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    // Find the route by ID
    const route = await Route.findById(id);
    if (!route) {
      return res.status(404).json({ status: false, message: "Route not found" });
    }

    // Check if user already favorited the route
    const existingIndex = route.favorite.findIndex(
      (fav) => fav.userId.toString() === userId.toString()
    );

    if (existingIndex !== -1) {
      // If user already favorited, remove it (unfavorite)
      route.favorite.splice(existingIndex, 1);
      await route.save();
      return res.status(200).json({
        status: true,
        message: "Route unfavorited successfully",
        data: route.favorite,
      });
    }

    // If user hasn't favorited, add to favorites
    route.favorite.push({ userId });  
    await route.save();  

    return res.status(200).json({
      status: true,
      message: "Route added to favorites successfully",
      data: route.favorite,
    });
  } catch (error) {
    console.log("Error in favoriting route", error);
    return res.status(500).json({ status: false, message: error.message });
  }
};

// Get all favorite routes of a user
const getAllMyFavoriteRoutes = async (req, res) => {

  console.log(req.user._id);
  try {
    const favoriteRoutes = await Route.find({
      isUser: "admin",
      "favorite.userId": req.user._id,
    }).populate("favorite.userId");

    if (!favoriteRoutes || favoriteRoutes.length === 0) {
      return res.status(200).json({
        status: true,
        message: "No favorite routes found",
        data: [],
      });
    }

    return res.status(200).json({
      status: true,
      message: "Favorite routes fetched successfully",
      data: favoriteRoutes,
    });
  } catch (error) {
    console.error("Error fetching favorite routes:", error);
    return res.status(500).json({
      status: false,
      message: "Internal server error, please try again later",
    });
  }
};

const createReview = async (req, res) => {

  const { id } = req.params
  const { reviewMessage, rating } = req.body
  const userId = req.user._id;

  const newReview = {
    rating,
    reviewMessage,
    userId,
  };

  try {

    const route = await Route.findById(id);

    if (!route) {
      return res.status(404).json({ message: "Route not found" });
    }

    route.reviews.push(newReview);

    await route.save();

    return res.status(200).json({ message: "Review added successfully", data: newReview });
  }

  catch (error) {
    console.error("Error adding review:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}


export { getTestCentreWithRoutes, toggleFavorite, incrementViews, getAllRoutes, getAllMyFavoriteRoutes, getARoute, getAllRoutesOfUser, createReview };
