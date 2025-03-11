import express from 'express';
import { getTestCentreWithRoutes, toggleFavorite, updateRating, incrementViews } from "../controller/routeCentre.controller.js";
import {verifyJWT} from "../middleware/auth.middleware.js"

const router = express.Router();

router.get('/route/:id', verifyJWT, getTestCentreWithRoutes);
router.put('/increment-views/:id', verifyJWT, incrementViews);
router.put('/favorite/:id', verifyJWT, toggleFavorite);
router.put('/rating/:id', verifyJWT, updateRating);



export default router