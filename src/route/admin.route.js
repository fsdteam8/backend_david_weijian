import express from "express";
import {
  getAllUsers,
  updateUserRole,
  deleteUser,
  getAllContactUsSubmissions,
  getAllBugReports,
} from "../controller/admin.controller.js";
import { isAdmin } from "../middleware/role.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/all-users", verifyJWT, isAdmin, getAllUsers);
router.put("/update-role", verifyJWT, isAdmin, updateUserRole);
router.delete("/delete-user", verifyJWT, isAdmin, deleteUser);
router.get("/contact-details", verifyJWT, isAdmin, getAllContactUsSubmissions);
router.get("/bug-report", verifyJWT, isAdmin, getAllBugReports);

export default router;
