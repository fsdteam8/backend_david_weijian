import express from 'express';
import {searchTestCentres, getTestCenterDetails} from "../controller/testCentre.controller.js"
import {verifyJWT} from "../middleware/auth.middleware.js"

const router = express.Router();

router.get('/search', verifyJWT, searchTestCentres);
router.get('/details/:id', verifyJWT, getTestCenterDetails);

export default router