import express from 'express';
import { getTestCentreWithRoutes } from "../controller/routeCentre.controller.js";
import {verifyJWT} from "../middleware/auth.middleware.js"

const router = express.Router();

router.get('/route/:id', verifyJWT, getTestCentreWithRoutes)



export default router