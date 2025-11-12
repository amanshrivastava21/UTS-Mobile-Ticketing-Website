const asyncHandler = require("express-async-handler");
const Train = require("../models/trainModel");

// @desc Get all trains/buses
// @route GET /api/trains
// @access Public
const getAllTrains = asyncHandler(async (req, res) => {
  const trains = await Train.find({});
  res.status(200).json(trains);
});

// @desc Get single train/bus by ID
// @route GET /api/trains/:id
// @access Public
const getTrainById = asyncHandler(async (req, res) => {
  const train = await Train.findById(req.params.id);
  
  if (!train) {
    res.status(404);
    throw new Error("Train/Bus not found");
  }
  
  res.status(200).json(train);
});

// @desc Create new train/bus
// @route POST /api/trains
// @access Private (Admin only)
const createTrain = asyncHandler(async (req, res) => {
  const { name, number, type, totalSeats, status } = req.body;

  if (!name || !number || !type || !totalSeats) {
    res.status(400);
    throw new Error("Please provide all required fields");
  }

  // Check if train/bus number already exists
  const trainExists = await Train.findOne({ number });
  if (trainExists) {
    res.status(400);
    throw new Error("Train/Bus number already exists");
  }

  const train = await Train.create({
    name,
    number,
    type,
    totalSeats,
    status: status || "active",
  });

  res.status(201).json(train);
});

// @desc Update train/bus
// @route PUT /api/trains/:id
// @access Private (Admin only)
const updateTrain = asyncHandler(async (req, res) => {
  const train = await Train.findById(req.params.id);

  if (!train) {
    res.status(404);
    throw new Error("Train/Bus not found");
  }

  const updatedTrain = await Train.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  res.status(200).json(updatedTrain);
});

// @desc Delete train/bus
// @route DELETE /api/trains/:id
// @access Private (Admin only)
const deleteTrain = asyncHandler(async (req, res) => {
  const train = await Train.findById(req.params.id);

  if (!train) {
    res.status(404);
    throw new Error("Train/Bus not found");
  }

  await Train.findByIdAndDelete(req.params.id);
  res.status(200).json({ message: "Train/Bus deleted successfully" });
});

module.exports = {
  getAllTrains,
  getTrainById,
  createTrain,
  updateTrain,
  deleteTrain,
};
