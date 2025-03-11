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

// Increment view count for a route
// const view = async (id) => {
//   return await Route.findByIdAndUpdate(id, { $inc: { view: 1 } }, { new: true });
// };

// // Toggle favorite status for a route
// const favorite = async (id) => {
//   const route = await Route.findById(id);
//   if (!route) throw new Error('Route not found');
//   route.favorite = !route.favorite;
//   return await route.save();
// };

// // Add or update rating for a route
// const rating = async (id, userId, value) => {
//   const route = await Route.findById(id);
//   if (!route) throw new Error('Route not found');

//   const existingRating = route.ratings.find(r => r.userId === userId);
//   if (existingRating) {
//     existingRating.value = value;
//   } else {
//     route.ratings.push({ userId, value });
//   }

//   // Calculate average rating
//   const totalRatings = route.ratings.reduce((sum, r) => sum + r.value, 0);
//   route.rating = totalRatings / route.ratings.length;

//   return await route.save();
// };

export { getTestCentreWithRoutes };
