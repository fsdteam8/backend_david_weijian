import express from 'express';
import { getTestCentreWithRoutes, toggleFavorite, incrementViews, getAllRoutes, getAllMyFavoriteRoutes, getARoute, getAllRoutesOfUser, createReview } from "../controller/routeCentre.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js"
// import { updateAveragePassRateForRouteCentre } from '../controller/avgPassRate.controller.js';

const router = express.Router();

router.get('/route/:id', verifyJWT, getTestCentreWithRoutes)
router.get("/all", verifyJWT, getAllRoutes)
router.get('/route/:id', verifyJWT, getTestCentreWithRoutes);
router.get("/get-all-imported-routes", verifyJWT, getAllRoutesOfUser)
router.get("/favorite", verifyJWT, getAllMyFavoriteRoutes)
router.get("/get-a-route/:id", verifyJWT, getARoute)
router.put('/increment-views/:id', verifyJWT, incrementViews)
router.put('/favorite/:id', verifyJWT, toggleFavorite)
router.post('/create-review/:id', verifyJWT, createReview)
// router.patch("/average-pass-rate/:routeId", updateAveragePassRateForRouteCentre);


export default router