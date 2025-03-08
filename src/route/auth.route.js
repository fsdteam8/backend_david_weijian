import {Router} from "express";
import {userRegister, userLogin, userLogout, refreshAccessToken, forgotPassword} from "../controller/auth.controller.js"
import {verifyJWT} from "../middleware/auth.middleware.js"

const router = Router();

router.post("/userRegister", userRegister)
router.post("/userLogin", userLogin)
router.get("/userLogout", verifyJWT, userLogout)
router.post("/refreshAccessToken", refreshAccessToken)
router.post("/forgotPassword", forgotPassword)

export default router;
