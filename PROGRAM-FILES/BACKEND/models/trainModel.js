const mongoose = require("mongoose");

// Define the schema for trains/buses
const trainSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter train/bus name"],
    },
    number: {
      type: String,
      required: [true, "Please enter train/bus number"],
      unique: true,
    },
    type: {
      type: String,
      enum: ["train", "bus"],
      required: [true, "Please specify vehicle type"],
    },
    totalSeats: {
      type: Number,
      required: [true, "Please enter total seats"],
      default: 50,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "maintenance"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Train", trainSchema);
