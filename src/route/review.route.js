import express from 'express';
import {createReview} from "../controller/review.controller.js"
import {verifyJWT} from "../middleware/auth.middleware.js"

const router = express.Router();

router.post('/', verifyJWT, createReview)


export default router