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

const getAllRoutes = async (req, res) => {

  try {

    const routes = await Route.find({ isUser: true })

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
}

const getAllMyFavoriteRoutes = async (req, res) => {

  const { userId } = req.params

  try {

    const favoriteRoutes = await Route.find({ isUser: true, "favorite.userId": userId })

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
}

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

// Add a new rating for a route
const updateRating = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const { value } = req.body;

    const route = await Route.findById(id);
    if (!route) {
      return res
        .status(404)
        .json({ status: false, message: "Route not found" });
    }

    // Find existing rating by user
    const existingRating = route.ratings.find(
      (r) => r.userId.toString() === userId.toString()
    );

    if (existingRating) {
      existingRating.value = value;
    } else {
      route.ratings.push({ userId, value });
    }

    // Calculate average rating
    const totalRatings = route.ratings.reduce((sum, r) => sum + r.value, 0);
    route.rating = totalRatings / route.ratings.length;

    await route.save();
    return res
      .status(200)
      .json({ status: true, message: "Rating updated", data: route.rating });
  } catch (error) {
    console.log("Error in ratting controller", error);
    return res.status(500).json({ status: false, message: error.message });
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
    console.log("Error in favoriting route", error);
    return res.status(500).json({ status: false, message: error.message });
  }
};


export { getTestCentreWithRoutes, toggleFavorite, updateRating, incrementViews, getAllRoutes, getAllMyFavoriteRoutes };
