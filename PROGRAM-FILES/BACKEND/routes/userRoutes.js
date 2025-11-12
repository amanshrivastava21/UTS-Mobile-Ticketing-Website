const express = require("express");
const {
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  deleteUser,
} = require("../controllers/userController");
const { protect, admin } = require("../middleware/authMiddleware");
const User = require("../models/userModel"); // Import User model

const router = express.Router();

/**
 * @route   GET /api/users/profile
 * @desc    Get logged-in user profile
 * @access  Private
 */
router.get("/profile", protect, getUserProfile);

/**
 * @route   PUT /api/users/profile
 * @desc    Update logged-in user profile
 * @access  Private
 */
router.put("/profile", protect, updateUserProfile);

/**
 * @route   GET /api/users
 * @desc    Get all users (admin only)
 * @access  Private/Admin
 */
router.get("/", protect, admin, getAllUsers);

/**
 * @route   DELETE /api/users/:id
 * @desc    Delete a user (admin only)
 * @access  Private/Admin
 */
router.delete("/:id", protect, admin, deleteUser);

/**
 * @route   POST /api/users
 * @desc    Add a new member (admin or student) - admin only
 * @access  Private/Admin
 */
router.post("/", protect, admin, async (req, res) => {
  const { name, email, id, role = "student", password = "password123" } = req.body;
  if (!name || !email || !id) {
    return res.status(400).json({ message: "Please provide name, email, and id" });
  }
  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }
  // Create user (default password, can be changed later)
  const user = await User.create({ name, email, id, role, password });
  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    id: user.id,
    role: user.role,
  });
});

module.exports = router;