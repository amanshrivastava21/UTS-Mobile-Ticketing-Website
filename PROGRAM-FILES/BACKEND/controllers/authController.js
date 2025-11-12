const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const generateToken = require("../utils/generateToken");

// Default admin credentials
const DEFAULT_ADMIN = {
  email: "admin@gmail.com",
  password: "admin123",
  name: "Admin",
  role: "admin",
};

// @desc Register a new user (Admin or Student)
// @route POST /api/auth/register
// @access Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    res.status(400);
    throw new Error("Please provide name, email, password, and role");
  }

  // Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  // Create new user
  const user = await User.create({ name, email, password, role });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @desc Login User (Admin or Student)
// @route POST /api/auth/login
// @access Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Please provide both email and password");
  }

  if (!role) {
    res.status(400);
    throw new Error("Please specify login role (admin or user)");
  }

  if (role !== "admin" && role !== "user") {
    res.status(400);
    throw new Error("Invalid role. Must be 'admin' or 'user'");
  }

  // Check for default admin credentials
  if (
    email === DEFAULT_ADMIN.email &&
    password === DEFAULT_ADMIN.password &&
    role === "admin"
  ) {
    // Find the default admin in database
    const adminUser = await User.findOne({ email: DEFAULT_ADMIN.email });
    if (adminUser) {
      const token = generateToken(adminUser._id);
      return res.status(200).json({
        message: "Login successful",
        user: {
          id: adminUser._id,
          name: adminUser.name,
          email: adminUser.email,
          role: adminUser.role,
        },
        token,
      });
    }
  }

  // Find user
  const user = await User.findOne({ email });
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Check if user's role matches the login role selected
  if (user.role !== role) {
    res.status(403);
    throw new Error(
      `Access denied. This account is registered as ${user.role}. Please use the correct login option.`
    );
  }

  // Compare password
  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    res.status(401);
    throw new Error("Invalid credentials");
  }

  // Generate token using the utility function
  const token = generateToken(user._id);

  res.status(200).json({
    message: "Login successful",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token,
  });
});

// @desc Get currently logged-in user info
// @route GET /api/auth/current
// @access Private
const currentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  res.status(200).json(user);
});

module.exports = { registerUser, loginUser, currentUser };