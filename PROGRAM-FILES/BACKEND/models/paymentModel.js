const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    paymentType: {
      type: String,
      enum: ["late_fee", "membership", "lost_book", "damage"],
      default: "late_fee",
    },
    relatedLoan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Loan",
      default: null,
    },
    paymentMethod: {
      type: String,
      enum: ["card", "upi", "cash", "online", "stripe"],
      default: "cash",
    },
    status: {
      type: String,
      enum: ["pending", "completed", "waived"],
      default: "pending",
    },
    description: {
      type: String,
      trim: true,
      maxlength: 200,
    },
    transactionId: {
      type: String,
      unique: true,
      required: true,
    },
    dueDate: {
      type: Date,
      default: null,
    },
    paidDate: {
      type: Date,
      default: null,
    },
    // Stripe-specific fields
    stripeSessionId: {
      type: String,
      default: null,
    },
    stripePaymentIntentId: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);
