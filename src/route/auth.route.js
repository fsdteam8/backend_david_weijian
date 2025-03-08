import { Router } from "express";
import {
  userRegister,
  userLogin,
  userLogout,
  refreshAccessToken,
  forgotPassword,
  verifyOtp,
  resendOTP,
  resetPassword,
} from "../controller/auth.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/user-register", userRegister);
router.post("/user-login", userLogin);
router.get("/user-logout", verifyJWT, userLogout);
router.post("/refresh-accessToken", refreshAccessToken);
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOtp);
router.post("/resend-otp", resendOTP);
router.post("/reset-password", verifyJWT, resetPassword);

export default router;
