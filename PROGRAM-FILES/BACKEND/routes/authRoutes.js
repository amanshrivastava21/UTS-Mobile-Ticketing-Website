const express = require("express");
const { registerUser, loginUser, currentUser } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware"); // Ensure middleware exports 'protect'

const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user (student or admin)
 * @access  Public
 */
router.post("/register", registerUser);

/**
 * @route   POST /api/auth/login
 * @desc    Login user and return token
 * @access  Public
 */
router.post("/login", loginUser);

/**
 * @route   GET /api/auth/current
 * @desc    Get currently logged-in user info
 * @access  Private
 */
router.get("/current", protect, currentUser);

module.exports = router;
