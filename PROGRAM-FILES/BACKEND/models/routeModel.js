const mongoose = require("mongoose");

// Define the schema for routes
const routeSchema = mongoose.Schema(
  {
    train: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Train",
      required: true,
    },
    source: {
      type: String,
      required: [true, "Please enter source location"],
    },
    destination: {
      type: String,
      required: [true, "Please enter destination location"],
    },
    departureTime: {
      type: String,
      required: [true, "Please enter departure time"],
    },
    arrivalTime: {
      type: String,
      required: [true, "Please enter arrival time"],
    },
    duration: {
      type: String,
      required: [true, "Please enter journey duration"],
    },
    fare: {
      type: Number,
      required: [true, "Please enter fare amount"],
    },
    availableSeats: {
      type: Number,
      required: true,
    },
    daysOfOperation: {
      type: [String],
      enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      default: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    },
    status: {
      type: String,
      enum: ["active", "cancelled", "delayed"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster search queries
routeSchema.index({ source: 1, destination: 1 });

module.exports = mongoose.model("Route", routeSchema);
