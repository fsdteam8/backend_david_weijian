import express from "express";
import passport from "passport";
import { googleAuthSuccess, googleAuthFailure, logout } from "../controller/googleLogin.controller.js";

const router = express.Router();

// Redirect to authentication
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Confirmation of login
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/api/v1/auth/google/failure" }),
  googleAuthSuccess
);

// Failiure
router.get("/google/failure", googleAuthFailure);

// Logout
router.get("/logout", logout);

export default router;
