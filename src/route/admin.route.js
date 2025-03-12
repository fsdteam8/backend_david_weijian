import express from "express";
import {
  adminLogin,
  getAllUsers,
  updateUserRole,
  deleteUser,
  getAllContactUsSubmissions,
  getAllBugReports,
  addTestCenter,
  updateTestCenter,
  deleteTestCenter,
  createRoute,
  updateRoute,
  deleteRoute,
  getAllReview
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
router.put("/update-test-centre/:id", verifyJWT, isAdmin, updateTestCenter);
router.delete("/delete-test-centre/:id", verifyJWT, isAdmin, deleteTestCenter);

// <<<<<<<<<<<<<<<< CREATE NEW ROUTE-CENTRE FOR ADMIN >>>>>>>>>>>>>>>>>>>>
router.post("/create-route", verifyJWT, isAdmin, createRoute);
router.put("/update-route/:id", verifyJWT, isAdmin, updateRoute);
router.delete("/delete-route/:id", verifyJWT, isAdmin, deleteRoute);

// <<<<<<<<<<<<<<<< REVIEW FOR ADMIN >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
router.get("/all-review", verifyJWT, isAdmin, getAllReview);

export default router;
