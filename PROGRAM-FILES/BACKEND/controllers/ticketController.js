const asyncHandler = require("express-async-handler");
const Ticket = require("../models/ticketModel");
const Route = require("../models/routeModel");
const User = require("../models/userModel");

// @desc Book a new ticket
// @route POST /api/tickets
// @access Private
const bookTicket = asyncHandler(async (req, res) => {
  const {
    routeId,
    passengerName,
    passengerAge,
    passengerGender,
    travelDate,
    numberOfSeats,
  } = req.body;

  if (!routeId || !passengerName || !passengerAge || !passengerGender || !travelDate || !numberOfSeats) {
    res.status(400);
    throw new Error("Please provide all required fields");
  }

  // Verify route exists
  const route = await Route.findById(routeId).populate("train");
  if (!route) {
    res.status(404);
    throw new Error("Route not found");
  }

  // Check if enough seats are available
  if (route.availableSeats < numberOfSeats) {
    res.status(400);
    throw new Error(`Only ${route.availableSeats} seats available`);
  }

  // Calculate total fare
  const totalFare = route.fare * numberOfSeats;

  // Create ticket
  const ticket = await Ticket.create({
    user: req.user.id,
    route: routeId,
    passengerName,
    passengerAge,
    passengerGender,
    travelDate,
    numberOfSeats,
    totalFare,
    status: "booked",
    paymentStatus: "paid",
  });

  // Update available seats in route
  route.availableSeats -= numberOfSeats;
  await route.save();

  // Add ticket to user's booked tickets
  await User.findByIdAndUpdate(req.user.id, {
    $push: { bookedTickets: ticket._id },
  });

  const populatedTicket = await Ticket.findById(ticket._id)
    .populate({
      path: "route",
      populate: { path: "train" },
    })
    .populate("user", "name email");

  res.status(201).json(populatedTicket);
});

// @desc Get all tickets for logged-in user
// @route GET /api/tickets/my-tickets
// @access Private
const getMyTickets = asyncHandler(async (req, res) => {
  const tickets = await Ticket.find({ user: req.user.id })
    .populate({
      path: "route",
      populate: { path: "train" },
    })
    .sort({ bookingDate: -1 });

  res.status(200).json(tickets);
});

// @desc Get all tickets (Admin)
// @route GET /api/tickets
// @access Private (Admin only)
const getAllTickets = asyncHandler(async (req, res) => {
  const tickets = await Ticket.find({})
    .populate({
      path: "route",
      populate: { path: "train" },
    })
    .populate("user", "name email")
    .sort({ bookingDate: -1 });

  res.status(200).json(tickets);
});

// @desc Get single ticket by ID
// @route GET /api/tickets/:id
// @access Private
const getTicketById = asyncHandler(async (req, res) => {
  const ticket = await Ticket.findById(req.params.id)
    .populate({
      path: "route",
      populate: { path: "train" },
    })
    .populate("user", "name email");

  if (!ticket) {
    res.status(404);
    throw new Error("Ticket not found");
  }

  // Check if user owns the ticket or is admin
  if (ticket.user._id.toString() !== req.user.id && req.user.role !== "admin") {
    res.status(403);
    throw new Error("Not authorized to access this ticket");
  }

  res.status(200).json(ticket);
});

// @desc Cancel ticket
// @route PUT /api/tickets/:id/cancel
// @access Private
const cancelTicket = asyncHandler(async (req, res) => {
  const ticket = await Ticket.findById(req.params.id);

  if (!ticket) {
    res.status(404);
    throw new Error("Ticket not found");
  }

  // Check if user owns the ticket
  if (ticket.user.toString() !== req.user.id && req.user.role !== "admin") {
    res.status(403);
    throw new Error("Not authorized to cancel this ticket");
  }

  // Check if ticket is already cancelled
  if (ticket.status === "cancelled") {
    res.status(400);
    throw new Error("Ticket is already cancelled");
  }

  // Update ticket status
  ticket.status = "cancelled";
  ticket.paymentStatus = "refunded";
  await ticket.save();

  // Restore available seats in route
  const route = await Route.findById(ticket.route);
  if (route) {
    route.availableSeats += ticket.numberOfSeats;
    await route.save();
  }

  const populatedTicket = await Ticket.findById(ticket._id)
    .populate({
      path: "route",
      populate: { path: "train" },
    })
    .populate("user", "name email");

  res.status(200).json(populatedTicket);
});

// @desc Get ticket statistics (Admin)
// @route GET /api/tickets/stats
// @access Private (Admin only)
const getTicketStats = asyncHandler(async (req, res) => {
  const totalTickets = await Ticket.countDocuments();
  const bookedTickets = await Ticket.countDocuments({ status: "booked" });
  const cancelledTickets = await Ticket.countDocuments({ status: "cancelled" });
  const completedTickets = await Ticket.countDocuments({ status: "completed" });
  
  const totalRevenue = await Ticket.aggregate([
    { $match: { status: { $ne: "cancelled" } } },
    { $group: { _id: null, total: { $sum: "$totalFare" } } },
  ]);

  res.status(200).json({
    totalTickets,
    bookedTickets,
    cancelledTickets,
    completedTickets,
    totalRevenue: totalRevenue[0]?.total || 0,
  });
});

module.exports = {
  bookTicket,
  getMyTickets,
  getAllTickets,
  getTicketById,
  cancelTicket,
  getTicketStats,
};
