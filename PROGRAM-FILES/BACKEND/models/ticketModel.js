const mongoose = require("mongoose");

// Define the schema for tickets
const ticketSchema = mongoose.Schema(
  {
    ticketId: {
      type: String,
      unique: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    route: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Route",
      required: true,
    },
    passengerName: {
      type: String,
      required: [true, "Please enter passenger name"],
    },
    passengerAge: {
      type: Number,
      required: [true, "Please enter passenger age"],
    },
    passengerGender: {
      type: String,
      enum: ["male", "female", "other"],
      required: [true, "Please select passenger gender"],
    },
    travelDate: {
      type: Date,
      required: [true, "Please select travel date"],
    },
    numberOfSeats: {
      type: Number,
      required: true,
      default: 1,
    },
    totalFare: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["booked", "cancelled", "completed"],
      default: "booked",
    },
    bookingDate: {
      type: Date,
      default: Date.now,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "refunded"],
      default: "paid",
    },
  },
  {
    timestamps: true,
  }
);

// Generate unique ticket ID before saving
ticketSchema.pre("save", function (next) {
  if (!this.ticketId) {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 7).toUpperCase();
    this.ticketId = `TKT${timestamp}${random}`;
  }
  next();
});

// Also generate ticket ID before validation
ticketSchema.pre("validate", function (next) {
  if (!this.ticketId) {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 7).toUpperCase();
    this.ticketId = `TKT${timestamp}${random}`;
  }
  next();
});

module.exports = mongoose.model("Ticket", ticketSchema);
