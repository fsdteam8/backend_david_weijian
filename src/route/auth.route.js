import {Router} from "express";
import {userRegister, userLogin} from "../controller/auth.controller.js"
import {verifyJWT} from "../middleware/auth.middleware.js"

const router = Router();

router.post("/userRegister", userRegister)
router.post("/userLogin", userLogin)

export default router;
