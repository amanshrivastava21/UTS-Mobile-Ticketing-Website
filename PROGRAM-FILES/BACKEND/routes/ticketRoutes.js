const express = require("express");
const {
  bookTicket,
  getMyTickets,
  getAllTickets,
  getTicketById,
  cancelTicket,
  getTicketStats,
} = require("../controllers/ticketController");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

// User routes
router.post("/", protect, bookTicket);
router.get("/my-tickets", protect, getMyTickets);
router.get("/:id", protect, getTicketById);
router.put("/:id/cancel", protect, cancelTicket);

// Admin routes
router.get("/admin/all", protect, admin, getAllTickets);
router.get("/admin/stats", protect, admin, getTicketStats);

module.exports = router;
