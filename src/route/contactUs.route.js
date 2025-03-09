import express from 'express';
import {submitContactUsForm} from "../controller/contactUs.controller.js";
import {verifyJWT} from "../middleware/auth.middleware.js"

const router = express.Router();

router.post("/contact-us", verifyJWT, submitContactUsForm)

export default router;