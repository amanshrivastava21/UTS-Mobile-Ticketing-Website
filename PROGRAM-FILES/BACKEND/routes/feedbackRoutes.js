const express = require("express");
const {
  addFeedback,
  getFeedbacksForBook,
  updateFeedback,
  deleteFeedback,
} = require("../controllers/feedbackController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// @desc Add new feedback for a book
// @route POST /api/feedback/:bookId
// @access Private (User)
router.post("/:bookId", protect, addFeedback);

// @desc Get all feedback for a specific book
// @route GET /api/feedback/book/:bookId
// @access Public
router.get("/book/:bookId", getFeedbacksForBook);

// @desc Update feedback (only by the user who created it)
// @route PUT /api/feedback/:id
// @access Private (User)
router.put("/:id", protect, updateFeedback);

// @desc Delete feedback (only by the user who created it)
// @route DELETE /api/feedback/:id
// @access Private (User)
router.delete("/:id", protect, deleteFeedback);

module.exports = router;
