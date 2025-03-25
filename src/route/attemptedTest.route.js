import express from 'express';
import { verifyJWT } from "../middleware/auth.middleware.js"

const router = express.Router();

router.post('/create', verifyJWT, createAttemptedTest);

export default router