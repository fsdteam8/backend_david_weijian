import {Router} from "express";
import {getUserProfile, updateUserProfile} from "../controller/userProfile.controller.js"
import {verifyJWT} from "../middleware/auth.middleware.js"

const router = Router();

router.get("/get-userProfile", verifyJWT, getUserProfile)
router.put("/update-userProfile", verifyJWT, updateUserProfile)


export default router