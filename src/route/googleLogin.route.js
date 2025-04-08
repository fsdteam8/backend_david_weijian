import express from "express";
import passport from "passport";
import { googleLogin, logout } from "../controller/googleLogin.controller.js";

const router = express.Router();

// Login
router.post("/google-login", googleLogin);

// Logout
router.get("/logout", logout);

export default router;
