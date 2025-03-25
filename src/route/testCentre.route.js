import express from 'express';
import {searchTestCentres, getTestCenterDetails} from "../controller/testCentre.controller.js"
import {verifyJWT} from "../middleware/auth.middleware.js"
import { updateAveragePassRateForTestCentre } from '../controller/avgPassRate.controller.js';

const router = express.Router();

router.get('/search', verifyJWT, searchTestCentres);
router.get('/details', verifyJWT, getTestCenterDetails);
router.get("/average-pass-rate/:testCentreId", updateAveragePassRateForTestCentre);

export default router