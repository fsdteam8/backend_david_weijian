import {Router} from "express";
import {userRegister} from "../controller/auth.controller.js"

const router = Router();

router.post("/userRegister", userRegister)

export default router;
