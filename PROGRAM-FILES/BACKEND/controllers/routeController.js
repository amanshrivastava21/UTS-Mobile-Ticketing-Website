const asyncHandler = require("express-async-handler");
const Route = require("../models/routeModel");
const Train = require("../models/trainModel");

// @desc Search routes by source and destination
// @route GET /api/routes/search?source=...&destination=...
// @access Public
const searchRoutes = asyncHandler(async (req, res) => {
  const { source, destination } = req.query;

  if (!source || !destination) {
    res.status(400);
    throw new Error("Please provide both source and destination");
  }

  const routes = await Route.find({
    source: { $regex: source, $options: "i" },
    destination: { $regex: destination, $options: "i" },
    status: "active",
  }).populate("train");

  res.status(200).json(routes);
});

// @desc Get all routes
// @route GET /api/routes
// @access Public
const getAllRoutes = asyncHandler(async (req, res) => {
  const routes = await Route.find({}).populate("train");
  res.status(200).json(routes);
});

// @desc Get single route by ID
// @route GET /api/routes/:id
// @access Public
const getRouteById = asyncHandler(async (req, res) => {
  const route = await Route.findById(req.params.id).populate("train");
  
  if (!route) {
    res.status(404);
    throw new Error("Route not found");
  }
  
  res.status(200).json(route);
});

// @desc Create new route
// @route POST /api/routes
// @access Private (Admin only)
const createRoute = asyncHandler(async (req, res) => {
  const {
    train,
    source,
    destination,
    departureTime,
    arrivalTime,
    duration,
    fare,
    daysOfOperation,
  } = req.body;

  if (!train || !source || !destination || !departureTime || !arrivalTime || !duration || !fare) {
    res.status(400);
    throw new Error("Please provide all required fields");
  }

  // Verify train exists
  const trainExists = await Train.findById(train);
  if (!trainExists) {
    res.status(404);
    throw new Error("Train/Bus not found");
  }

  const route = await Route.create({
    train,
    source,
    destination,
    departureTime,
    arrivalTime,
    duration,
    fare,
    availableSeats: trainExists.totalSeats,
    daysOfOperation: daysOfOperation || ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
  });

  const populatedRoute = await Route.findById(route._id).populate("train");
  res.status(201).json(populatedRoute);
});

// @desc Update route
// @route PUT /api/routes/:id
// @access Private (Admin only)
const updateRoute = asyncHandler(async (req, res) => {
  const route = await Route.findById(req.params.id);

  if (!route) {
    res.status(404);
    throw new Error("Route not found");
  }

  // If train is being updated, verify it exists
  if (req.body.train) {
    const trainExists = await Train.findById(req.body.train);
    if (!trainExists) {
      res.status(404);
      throw new Error("Train/Bus not found");
    }
  }

  const updatedRoute = await Route.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  ).populate("train");

  res.status(200).json(updatedRoute);
});

// @desc Delete route
// @route DELETE /api/routes/:id
// @access Private (Admin only)
const deleteRoute = asyncHandler(async (req, res) => {
  const route = await Route.findById(req.params.id);

  if (!route) {
    res.status(404);
    throw new Error("Route not found");
  }

  await Route.findByIdAndDelete(req.params.id);
  res.status(200).json({ message: "Route deleted successfully" });
});

module.exports = {
  searchRoutes,
  getAllRoutes,
  getRouteById,
  createRoute,
  updateRoute,
  deleteRoute,
};
