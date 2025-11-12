/**
 * @desc Update feedback (only by the user who created it)
 * @route PUT /api/feedback/:id
 * @access Private (User)
 */
const updateFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) return res.status(404).json({ message: "Feedback not found" });

    // Only allow the user who created the feedback to update it
    if (feedback.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this feedback" });
    }

    const { rating, comment } = req.body;
    if (rating) feedback.rating = rating;
    if (comment) feedback.comment = comment;

    await feedback.save();
    res.status(200).json({ message: "Feedback updated successfully", feedback });
  } catch (error) {
    console.error("Error updating feedback:", error);
    res.status(500).json({ message: "Server error" });
  }
};
const Feedback = require("../models/feedbackModel");
const Book = require("../models/bookModel");
const User = require("../models/userModel");

/**
 * @desc Add feedback for a book
 * @route POST /api/feedback
 * @access Private (User)
 */
const addFeedback = async (req, res) => {
  try {
    const { bookId, rating, comment } = req.body;

    if (!bookId || !rating) {
      return res.status(400).json({ message: "Book ID and rating are required" });
    }

    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: "Book not found" });

    const user = await User.findById(req.user._id);

    // Check if the user already left feedback for this book
    const existingFeedback = await Feedback.findOne({ user: user._id, book: bookId });
    if (existingFeedback) {
      return res.status(400).json({ message: "You have already left feedback for this book" });
    }

    const feedback = await Feedback.create({
      user: user._id,
      book: bookId,
      rating,
      comment,
    });

    res.status(201).json({ message: "Feedback added successfully", feedback });
  } catch (error) {
    console.error("Error adding feedback:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @desc Get feedback for a specific book
 * @route GET /api/feedback/book/:bookId
 * @access Public
 */
const getFeedbacksForBook = async (req, res) => {
  try {
    const feedback = await Feedback.find({ book: req.params.bookId })
      .populate("user", "name email");

    if (!feedback || feedback.length === 0) {
      return res.status(404).json({ message: "No feedback found for this book" });
    }

    res.status(200).json(feedback);
  } catch (error) {
    console.error("Error fetching feedback:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @desc Get all feedback (Admin only)
 * @route GET /api/feedback
 * @access Private (Admin)
 */
const getAllFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find()
      .populate("user", "name email")
      .populate("book", "title author");
    res.status(200).json(feedback);
  } catch (error) {
    console.error("Error fetching feedback:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @desc Delete a feedback (Admin only)
 * @route DELETE /api/feedback/:id
 * @access Private (Admin)
 */
const deleteFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) return res.status(404).json({ message: "Feedback not found" });

    await feedback.deleteOne();
    res.status(200).json({ message: "Feedback deleted successfully" });
  } catch (error) {
    console.error("Error deleting feedback:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  addFeedback,
  getFeedbacksForBook,
  getAllFeedback,
  deleteFeedback,
  updateFeedback,
};
