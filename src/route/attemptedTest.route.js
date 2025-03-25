import express from 'express';
import { verifyJWT } from "../middleware/auth.middleware.js"
import { createAttemptedTest } from '../controller/attemptedTest.controller.js';

const router = express.Router();

router.post('/create', verifyJWT, createAttemptedTest);

export default router