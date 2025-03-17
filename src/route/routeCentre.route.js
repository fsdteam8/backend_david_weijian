import express from 'express';
import { getTestCentreWithRoutes, toggleFavorite, updateRating, incrementViews, getAllRoutes, getAllMyFavoriteRoutes } from "../controller/routeCentre.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js"

const router = express.Router();

router.get('/route/:id', verifyJWT, getTestCentreWithRoutes);
router.get("/get-all-imported-routes", verifyJWT, getAllRoutes)
router.get("/favorite/:userId", verifyJWT, getAllMyFavoriteRoutes)
router.put('/increment-views/:id', verifyJWT, incrementViews);
router.put('/favorite/:id', verifyJWT, toggleFavorite);
router.put('/rating/:id', verifyJWT, updateRating);

export default router