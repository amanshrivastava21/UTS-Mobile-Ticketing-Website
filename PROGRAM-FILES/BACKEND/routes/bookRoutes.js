const express = require("express");
const {
  addBook,
  getAllBooks,
  getBookById,
  updateBook,
  deleteBook,
  borrowBook,
  returnBook,
} = require("../controllers/bookController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * @route   POST /api/books
 * @desc    Add a new book (Admin only)
 * @access  Private/Admin
 */
router.post("/", protect, adminOnly, addBook);

/**
 * @route   GET /api/books
 * @desc    Get all books
 * @access  Public
 */
router.get("/", getAllBooks);

/**
 * @route   GET /api/books/:id
 * @desc    Get a single book by ID
 * @access  Public
 */
router.get("/:id", getBookById);

/**
 * @route   PUT /api/books/:id
 * @desc    Update book details (Admin only)
 * @access  Private/Admin
 */
router.put("/:id", protect, adminOnly, updateBook);

/**
 * @route   DELETE /api/books/:id
 * @desc    Delete a book (Admin only)
 * @access  Private/Admin
 */
router.delete("/:id", protect, adminOnly, deleteBook);

/**
 * @route   POST /api/books/borrow/:id
 * @desc    Borrow a book (User)
 * @access  Private
 */
router.post("/borrow/:id", protect, borrowBook);

/**
 * @route   POST /api/books/return/:id
 * @desc    Return a borrowed book (User)
 * @access  Private
 */
router.post("/return/:id", protect, returnBook);

module.exports = router;
