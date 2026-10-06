import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get(
  "/dashboard",
  protect,
  authorize("user", "admin"),
  (req, res) => {
    res.json({
      success: true,
      message: "User Dashboard",
      user: req.user,
    });
  }
);

export default router;