import express from 'express';
import { verifyJWT } from "../middleware/auth.middleware.js"
import { createAttemptedTest, updateTestCentrePassRate, getAttemptedTestByRoute, deleteAttemptedTest } from '../controller/attemptedTest.controller.js';

const router = express.Router();

router.post('/create', verifyJWT, createAttemptedTest);
router.patch('/update-pass-rate/:testCentreId', verifyJWT, updateTestCentrePassRate);
router.get('/route/:routeId', verifyJWT, getAttemptedTestByRoute);
router.delete('/delete/:attemptedTestId', verifyJWT, deleteAttemptedTest);
export default router;