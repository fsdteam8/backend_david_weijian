import express from "express";
import {
  adminLogin,
  getAllUsers,
  updateUserRole,
  deleteUser,
  getAllContactUsSubmissions,
  getAllBugReports,
  addTestCenter
} from "../controller/admin.controller.js";
import { isAdmin } from "../middleware/role.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = express.Router();

// <<<<<<<<<<<<<<<< ADMIN LOGIN ROUTE >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
router.post("/login", adminLogin);

// <<<<<<<<<<<<<<<<< USER ROUTE FOR ADMIN >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
router.get("/all-users", verifyJWT, isAdmin, getAllUsers);
router.put("/update-role", verifyJWT, isAdmin, updateUserRole);
router.delete("/delete-user", verifyJWT, isAdmin, deleteUser);

// <<<<<<<<<<<<<<<< CONTACT-US ROUTE FOR ADMIN >>>>>>>>>>>>>>>>>>>>>>>>>>>
router.get("/contact-details", verifyJWT, isAdmin, getAllContactUsSubmissions);

// <<<<<<<<<<<<<<<< BUG-REPORT ROUTE FOR ADMIN >>>>>>>>>>>>>>>>>>>>>>>>>>
router.get("/bug-report", verifyJWT, isAdmin, getAllBugReports);

// <<<<<<<<<<<<<<<< TEST-CENTER ROUTE FOR ADMIN >>>>>>>>>>>>>>>>>>>>>>>>>>
router.post("/add-test-centre", verifyJWT, isAdmin, addTestCenter);

export default router;
