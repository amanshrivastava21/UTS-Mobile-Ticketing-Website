const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    // Book title
    title: {
      type: String,
      required: true,
      trim: true,
    },

    // Author of the book
    author: {
      type: String,
      required: true,
      trim: true,
    },

    // Genre/category (e.g. Fiction, Science, History)
    genre: {
      type: String,
      required: false,
    },

    // ISBN (unique book identifier)
    isbn: {
      type: String,
      required: true,
      unique: true,
    },

    // Year book was published
    publishedYear: {
      type: Number,
      required: false,
    },

    // Total number of copies in library
    totalCopies: {
      type: Number,
      required: true,
      min: 1,
    },

    // Number of currently available copies
    availableCopies: {
      type: Number,
      required: true,
      min: 0,
    },

    // Optional cover image
    coverImage: {
      type: String,
      required: false,
    },

    // Track who borrowed this book (optional, for relational reference)
    borrowedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Book", bookSchema);
