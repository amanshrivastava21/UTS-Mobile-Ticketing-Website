const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  createCheckoutSession,
  verifyPayment,
  handleWebhook,
  getStripeConfig,
} = require("../controllers/stripeController");

// Get Stripe publishable key (public)
router.get("/config", getStripeConfig);

// Create Stripe checkout session (protected)
router.post("/create-checkout-session", protect, createCheckoutSession);

// Verify payment after Stripe redirect (protected)
router.post("/verify-payment", protect, verifyPayment);

// Stripe webhook (no auth - Stripe signature verification instead)
// Note: This route needs raw body, so it should be handled differently in server.js
router.post("/webhook", express.raw({ type: "application/json" }), handleWebhook);

module.exports = router;
