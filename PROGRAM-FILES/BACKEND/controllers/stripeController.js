const Payment = require("../models/paymentModel");

// Lazy load Stripe to ensure env vars are loaded
const getStripe = () => {
  if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY === 'your_stripe_secret_key_here') {
    throw new Error('Stripe secret key not configured. Please add your Stripe secret key to .env file');
  }
  return require("stripe")(process.env.STRIPE_SECRET_KEY);
};

/**
 * @desc Create Stripe Checkout Session for payment
 * @route POST /api/payments/stripe/create-checkout-session
 * @access Private (User)
 */
const createCheckoutSession = async (req, res) => {
  try {
    const stripe = getStripe();
    const { paymentId, amount, description } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid payment amount" });
    }

    // Stripe minimum: ₹50 (50 cents equivalent)
    if (amount < 50) {
      return res.status(400).json({ 
        message: `Stripe requires a minimum payment of ₹50. Current amount: ₹${amount}. Please use cash/UPI/card for smaller amounts.` 
      });
    }

    // Verify payment exists and belongs to user
    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    if (payment.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    if (payment.status === "completed") {
      return res.status(400).json({ message: "Payment already completed" });
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr", // Indian Rupees
            product_data: {
              name: description || "Library Late Fee Payment",
              description: `Transaction ID: ${payment.transactionId}`,
            },
            unit_amount: Math.round(amount * 100), // Convert to smallest currency unit (paise)
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL || "http://localhost:5173"}/payment-success?session_id={CHECKOUT_SESSION_ID}&payment_id=${paymentId}`,
      cancel_url: `${process.env.FRONTEND_URL || "http://localhost:5173"}/payment-cancelled?payment_id=${paymentId}`,
      metadata: {
        paymentId: paymentId,
        userId: req.user._id.toString(),
        transactionId: payment.transactionId,
      },
    });

    // Update payment with Stripe session ID
    payment.stripeSessionId = session.id;
    await payment.save();

    res.status(200).json({
      message: "Checkout session created",
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    res.status(500).json({ 
      message: "Failed to create checkout session", 
      error: error.message 
    });
  }
};

/**
 * @desc Verify Stripe payment and update payment status
 * @route POST /api/payments/stripe/verify-payment
 * @access Private (User)
 */
const verifyPayment = async (req, res) => {
  try {
    const stripe = getStripe();
    const { sessionId, paymentId } = req.body;

    if (!sessionId || !paymentId) {
      return res.status(400).json({ message: "Session ID and Payment ID required" });
    }

    // Retrieve Stripe session
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return res.status(400).json({ 
        message: "Payment not completed", 
        status: session.payment_status 
      });
    }

    // Find and update payment
    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    // Verify ownership
    if (payment.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    // Update payment status
    if (payment.status !== "completed") {
      payment.status = "completed";
      payment.paymentMethod = "stripe";
      payment.paidDate = new Date();
      payment.stripePaymentIntentId = session.payment_intent;
      await payment.save();
    }

    res.status(200).json({
      message: "Payment verified successfully",
      payment,
    });
  } catch (error) {
    console.error("Payment verification error:", error);
    res.status(500).json({ 
      message: "Failed to verify payment", 
      error: error.message 
    });
  }
};

/**
 * @desc Webhook handler for Stripe events
 * @route POST /api/payments/stripe/webhook
 * @access Public (Stripe only)
 */
const handleWebhook = async (req, res) => {
  const stripe = getStripe();
  const sig = req.headers["stripe-signature"];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object;
      
      // Update payment status
      const paymentId = session.metadata.paymentId;
      if (paymentId) {
        const payment = await Payment.findById(paymentId);
        if (payment && payment.status !== "completed") {
          payment.status = "completed";
          payment.paymentMethod = "stripe";
          payment.paidDate = new Date();
          payment.stripePaymentIntentId = session.payment_intent;
          await payment.save();
          console.log(`Payment ${paymentId} marked as completed via webhook`);
        }
      }
      break;

    case "payment_intent.payment_failed":
      const failedIntent = event.data.object;
      console.log(`Payment failed: ${failedIntent.id}`);
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
};

/**
 * @desc Get Stripe publishable key
 * @route GET /api/payments/stripe/config
 * @access Public
 */
const getStripeConfig = async (req, res) => {
  res.status(200).json({
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  });
};

module.exports = {
  createCheckoutSession,
  verifyPayment,
  handleWebhook,
  getStripeConfig,
};
