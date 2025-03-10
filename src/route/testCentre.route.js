import express from 'express';
import {searchTestCentres} from "../controller/testCentre.controller.js"
import {verifyJWT} from "../middleware/auth.middleware.js"

const router = express.Router();

router.get('/search', verifyJWT, searchTestCentres);

export default router