import User from "../models/User.js";
import Task from "../models/Task.js";

// @desc    Get dashboard metrics summary
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalTasks = await Task.countDocuments();

    const completedTasks = await Task.countDocuments({ status: "completed" });
    const pendingTasks = await Task.countDocuments({ status: { $in: ["pending", "in-progress"] } });

    res.status(200).json({
      success: true,
      stats: { totalUsers, totalTasks, completedTasks, pendingTasks },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// FIXED: Added the missing getUsers controller function
// @desc    Get all registered profiles
// @route   GET /api/admin/users
// @access  Private/Admin
export const getUsers = async (req, res) => {
  try {
    // Fetch all records from MongoDB, excluding sensitive hashed passwords
    const users = await User.find({}).select("-password");

    res.status(200).json({
      success: true,
      users: users, 
      data: users, // Multi-layer defensive mapping to fit frontend extractors perfectly
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};