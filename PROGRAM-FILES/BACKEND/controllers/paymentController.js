const Payment = require("../models/paymentModel");
const User = require("../models/userModel");
const { v4: uuidv4 } = require("uuid");

/**
 * @desc Create a new payment
 * @route POST /api/payments
 * @access Private (User)
 */
const createPayment = async (req, res) => {
  try {
    const { amount, paymentMethod, description, paymentType } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid payment amount" });
    }

    const payment = await Payment.create({
      userId: req.user._id,
      amount,
      paymentMethod: paymentMethod || "cash",
      paymentType: paymentType || "membership",
      description,
      status: "pending",
      transactionId: `TXN-${uuidv4()}`,
      dueDate: new Date(),
    });

    res.status(201).json({ message: "Payment created successfully", payment });
  } catch (error) {
    console.error("Payment creation error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @desc Get all payments (Admin)
 * @route GET /api/payments
 * @access Private (Admin)
 */
const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate("userId", "name email")
      .populate("relatedLoan", "loanId")
      .sort({ createdAt: -1 });
    res.status(200).json(payments);
  } catch (error) {
    console.error("Fetching payments error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @desc Get payments of logged-in user
 * @route GET /api/payments/my
 * @access Private (User)
 */
const getUserPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.user._id })
      .populate("relatedLoan", "loanId")
      .sort({ createdAt: -1 });
    res.status(200).json(payments);
  } catch (error) {
    console.error("Fetching user payments error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @desc Get pending payments of logged-in user
 * @route GET /api/payments/my/pending
 * @access Private (User)
 */
const getUserPendingPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ 
      userId: req.user._id,
      status: "pending"
    })
      .populate("relatedLoan", "loanId")
      .sort({ createdAt: -1 });
    res.status(200).json(payments);
  } catch (error) {
    console.error("Fetching pending payments error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @desc Get all pending payments (Admin)
 * @route GET /api/payments/pending
 * @access Private (Admin)
 */
const getAllPendingPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ status: "pending" })
      .populate("userId", "name email")
      .populate("relatedLoan", "loanId")
      .sort({ createdAt: -1 });
    res.status(200).json(payments);
  } catch (error) {
    console.error("Fetching pending payments error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @desc Mark payment as completed (Admin)
 * @route PUT /api/payments/:id/complete
 * @access Private (Admin)
 */
const markPaymentAsCompleted = async (req, res) => {
  try {
    const { paymentMethod } = req.body;
    
    const payment = await Payment.findById(req.params.id);
    if (!payment) return res.status(404).json({ message: "Payment not found" });

    payment.status = "completed";
    payment.paidDate = new Date();
    if (paymentMethod) payment.paymentMethod = paymentMethod;
    
    await payment.save();

    res.status(200).json({ 
      message: "Payment marked as completed", 
      payment 
    });
  } catch (error) {
    console.error("Marking payment error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @desc Student pays their own pending payment
 * @route PUT /api/payments/:id/pay
 * @access Private (User)
 */
const payOwnPayment = async (req, res) => {
  try {
    const { paymentMethod } = req.body;
    
    const payment = await Payment.findById(req.params.id);
    if (!payment) return res.status(404).json({ message: "Payment not found" });

    // Verify the payment belongs to the logged-in user
    if (payment.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized: This payment doesn't belong to you" });
    }

    if (payment.status === "completed") {
      return res.status(400).json({ message: "Payment already completed" });
    }

    payment.status = "completed";
    payment.paidDate = new Date();
    if (paymentMethod) payment.paymentMethod = paymentMethod;
    
    await payment.save();

    res.status(200).json({ 
      message: "Payment successful", 
      payment 
    });
  } catch (error) {
    console.error("Payment processing error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createPayment,
  getAllPayments,
  getUserPayments,
  getUserPendingPayments,
  getAllPendingPayments,
  markPaymentAsCompleted,
  payOwnPayment,
};
