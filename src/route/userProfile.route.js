import {Router} from "express";
import {getUserProfile, updateUserProfile} from "../controller/userProfile.controller.js"
import {verifyJWT} from "../middleware/auth.middleware.js"
import upload from "../middleware/multer.middleware.js"

const router = Router();

router.get("/get-userProfile", verifyJWT, getUserProfile)
router.put("/update-userProfile", verifyJWT, upload.single("avatar"), updateUserProfile)


export default router