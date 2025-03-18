import express from 'express';
import { getTestCentreWithRoutes, toggleFavorite, updateRating, incrementViews, getAllRoutes, getAllMyFavoriteRoutes, getARoute } from "../controller/routeCentre.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js"

const router = express.Router();

router.get('/route/:id', verifyJWT, getTestCentreWithRoutes)
router.get("/all", verifyJWT, getAllRoutes)
router.get("/favorite/:userId", verifyJWT, getAllMyFavoriteRoutes)
router.get("/get-a-route/:id", verifyJWT, getARoute)
router.put('/increment-views/:id', verifyJWT, incrementViews)
router.put('/favorite/:id', verifyJWT, toggleFavorite)

export default router