const Book = require("../models/bookModel");
const User = require("../models/userModel");
const Loan = require("../models/loanModel");

/**
 * @desc Add a new book
 * @route POST /api/books
 * @access Private (Admin)
 */
const addBook = async (req, res) => {
  try {
    const { title, author, genre, isbn, publishedYear, totalCopies } = req.body;

    if (!title || !author || !isbn || !totalCopies) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

    const existingBook = await Book.findOne({ isbn });
    if (existingBook) {
      return res.status(400).json({ message: "Book with this ISBN already exists" });
    }

    const newBook = await Book.create({
      title,
      author,
      genre,
      isbn,
      publishedYear,
      totalCopies,
      availableCopies: totalCopies,
    });

    res.status(201).json({ message: "Book added successfully", book: newBook });
  } catch (error) {
    console.error("Error adding book:", error);
    res.status(500).json({ message: "Server error while adding book" });
  }
};

/**
 * @desc Get all books
 * @route GET /api/books
 * @access Public
 */
const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    res.status(200).json(books);
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).json({ message: "Server error while fetching books" });
  }
};

/**
 * @desc Get a single book
 * @route GET /api/books/:id
 * @access Public
 */
const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ message: "Server error while fetching book" });
  }
};

/**
 * @desc Update a book
 * @route PUT /api/books/:id
 * @access Private (Admin)
 */
const updateBook = async (req, res) => {
  try {
    const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedBook) return res.status(404).json({ message: "Book not found" });
    res.status(200).json({ message: "Book updated successfully", book: updatedBook });
  } catch (error) {
    res.status(500).json({ message: "Server error while updating book" });
  }
};

/**
 * @desc Delete a book
 * @route DELETE /api/books/:id
 * @access Private (Admin)
 */
const deleteBook = async (req, res) => {
  try {
    const deleted = await Book.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Book not found" });
    res.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error while deleting book" });
  }
};

/**
 * @desc Borrow a book
 * @route POST /api/books/borrow/:id
 * @access Private (User)
 */
const borrowBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });

    if (book.availableCopies < 1) {
      return res.status(400).json({ message: "No copies available for borrowing" });
    }

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.borrowedBooks) user.borrowedBooks = [];
    if (user.borrowedBooks.includes(book._id)) {
      return res.status(400).json({ message: "You have already borrowed this book" });
    }

    book.availableCopies -= 1;
    await book.save();

    user.borrowedBooks.push(book._id);
    await user.save();

    res.status(200).json({ message: "Book borrowed successfully", book });
  } catch (error) {
    console.error("Borrow error:", error);
    res.status(500).json({ message: "Server error while borrowing book" });
  }
};


/**
 * @desc Return a borrowed book
 * @route POST /api/books/return/:id
 * @access Private (User)
 */
const returnBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });

    const user = await User.findById(req.user._id);
    if (!user.borrowedBooks || !user.borrowedBooks.includes(book._id)) {
      return res.status(400).json({ message: "You have not borrowed this book" });
    }

    user.borrowedBooks = user.borrowedBooks.filter(
      (b) => b.toString() !== book._id.toString()
    );
    await user.save();

    book.availableCopies += 1;
    await book.save();

    res.status(200).json({ message: "Book returned successfully", book });
  } catch (error) {
    console.error("Return error:", error);
    res.status(500).json({ message: "Server error while returning book" });
  }
};

module.exports = {
  addBook,
  getAllBooks,
  getBookById,
  updateBook,
  deleteBook,
  borrowBook,
  returnBook,
};