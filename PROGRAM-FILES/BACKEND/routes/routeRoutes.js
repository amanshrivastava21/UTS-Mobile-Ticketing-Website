const express = require("express");
const {
  searchRoutes,
  getAllRoutes,
  getRouteById,
  createRoute,
  updateRoute,
  deleteRoute,
} = require("../controllers/routeController");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

// Public routes
router.get("/search", searchRoutes);
router.get("/", getAllRoutes);
router.get("/:id", getRouteById);

// Admin routes
router.post("/", protect, admin, createRoute);
router.put("/:id", protect, admin, updateRoute);
router.delete("/:id", protect, admin, deleteRoute);

module.exports = router;
