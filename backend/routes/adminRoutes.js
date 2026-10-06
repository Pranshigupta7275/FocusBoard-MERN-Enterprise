import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";
// FIXED: 1. Added getUsers to the import list
import { getDashboardStats, getUsers } from "../controllers/adminController.js";

const router = express.Router();

router.get("/test", (req, res) => {
  res.status(200).json({ message: "Admin test route is working!" });
});

router.get(
  "/stats",
  protect,
  authorize("admin"),
  getDashboardStats
);


router.get(
  "/users",
  protect,
  authorize("admin"),
  getUsers
);

export default router;