import {Router} from "express";
import {getUserProfile} from "../controller/userProfile.controller.js"
import {verifyJWT} from "../middleware/auth.middleware.js"

const router = Router();

router.get("/get-userProfile", verifyJWT, getUserProfile)


export default router