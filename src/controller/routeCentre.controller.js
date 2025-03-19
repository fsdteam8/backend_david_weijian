import { Route } from "../model/routeCentre.model.js";
import { TestCentre } from "../model/testCentre.model.js";

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

  const { userId } = req.params

  try {

    const routes = await Route.find({ isUser: "user", userId })

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

// Get all favorite routes
const getAllMyFavoriteRoutes = async (req, res) => {

  const { userId } = req.params

  try {

    const favoriteRoutes = await Route.find({ isUser: "user", "favorite.userId": userId })

    return res.status(200).json({
      status: true,
      data: favoriteRoutes
    })
  }

  catch (error) {
    return res.status(500).json({
      status: false,
      message: "Internal server error, please try again later"
    })
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

    const route = await Route.findById(id);
    if (!route) {
      return res.status(404).json({ status: false, message: "Route not found" });
    }

    // Check if user already favorited
    const existingIndex = route.favorite.findIndex(
      (fav) => fav.userId.toString() === userId.toString()
    );

    if (existingIndex !== -1) {
      route.favorite.splice(existingIndex, 1);
    } else {
      route.favorite.push({ userId });
    }

    await route.save();
    return res.status(200).json({
      status: true,
      message: "Favorite toggled",
      data: route.favorite,
    });
  } catch (error) {
    console.log("Error in favouriting route", error);
    return res.status(500).json({ status: false, message: error.message });
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
