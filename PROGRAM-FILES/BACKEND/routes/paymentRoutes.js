const express = require("express");
const {
  createPayment,
  getAllPayments,
  getUserPayments,
  getUserPendingPayments,
  getAllPendingPayments,
  markPaymentAsCompleted,
  payOwnPayment,
} = require("../controllers/paymentController");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

// @desc Create a new payment
// @route POST /api/payments
// @access Private (User)
router.post("/", protect, createPayment);

// @desc Get all payments (Admin)
// @route GET /api/payments
// @access Private (Admin)
router.get("/", protect, admin, getAllPayments);

// @desc Get all pending payments (Admin)
// @route GET /api/payments/pending
// @access Private (Admin)
router.get("/pending", protect, admin, getAllPendingPayments);

// @desc Get payments of logged-in user
// @route GET /api/payments/my
// @access Private (User)
router.get("/my", protect, getUserPayments);

// @desc Get pending payments of logged-in user
// @route GET /api/payments/my/pending
// @access Private (User)
router.get("/my/pending", protect, getUserPendingPayments);

// @desc Student pays their own payment
// @route PUT /api/payments/:id/pay
// @access Private (User)
router.put("/:id/pay", protect, payOwnPayment);

// @desc Mark payment as completed (Admin)
// @route PUT /api/payments/:id/complete
// @access Private (Admin)
router.put("/:id/complete", protect, admin, markPaymentAsCompleted);

module.exports = router;
