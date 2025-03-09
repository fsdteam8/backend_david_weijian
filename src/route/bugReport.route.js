import express from "express";
import { submitBugReport } from "../controller/bugReport.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import upload from "../middleware/multer.middleware.js";

const router = express.Router();

router.post("/submit", verifyJWT, upload.single("image"), submitBugReport);

export default router;
