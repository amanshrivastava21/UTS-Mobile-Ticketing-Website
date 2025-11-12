const express = require("express");
const {
  getAllTrains,
  getTrainById,
  createTrain,
  updateTrain,
  deleteTrain,
} = require("../controllers/trainController");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

// Public routes
router.get("/", getAllTrains);
router.get("/:id", getTrainById);

// Admin routes
router.post("/", protect, admin, createTrain);
router.put("/:id", protect, admin, updateTrain);
router.delete("/:id", protect, admin, deleteTrain);

module.exports = router;
