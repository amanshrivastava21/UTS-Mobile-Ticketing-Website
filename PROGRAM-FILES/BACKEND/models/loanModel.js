const mongoose = require("mongoose");

const loanSchema = new mongoose.Schema(
  {
    // Unique loan identifier (UUID)
    loanId: { type: String, required: true, unique: true },

    // Reference to the user who borrowed the book
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Reference to the borrowed book
    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },

    // When the loan was created (book borrowed)
    borrowDate: {
      type: Date,
      default: Date.now,
      required: true,
    },

    // Due date for return (14 days from borrow)
    dueDate: {
      type: Date,
      required: true,
    },

    // When the book was returned
    returnDate: {
      type: Date,
      default: null,
    },

    // Loan status
    status: {
      type: String,
      enum: ["borrowed", "returned", "overdue"],
      default: "borrowed",
    },
  },
  { timestamps: true }
);

// Optional: Automatically mark overdue loans
loanSchema.pre("save", function (next) {
  if (
    this.status === "borrowed" &&
    this.borrowDate &&
    !this.returnDate &&
    new Date() - this.borrowDate > 14 * 24 * 60 * 60 * 1000 // 14 days
  ) {
    this.status = "overdue";
  }
  next();
});

module.exports = mongoose.model("Loan", loanSchema);
