import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
  requestOtp,  
  verifyOtp    
} from "../controllers/authController.js";

import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

// --- CLASSIC PASSWORD ROUTES ---
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

router.post("/request-otp", requestOtp); 
router.post("/verify-otp", verifyOtp);   

// --- PROTECTED ROUTES ---
router.get("/profile", protect, getUserProfile);

// User + Admin
router.get(
  "/dashboard",
  protect,
  authorize("user", "admin"),
  (req, res) => {
    res.json({
      message: "Dashboard Access",
      role: req.user.role,
    });
  }
);

// Admin Only
router.get(
  "/admin",
  protect,
  authorize("admin"),
  (req, res) => {
    res.json({
      message: "Admin Dashboard",
    });
  }
);

export default router;