const Loan = require("../models/loanModel");
const Book = require("../models/bookModel");
const User = require("../models/userModel");
const Payment = require("../models/paymentModel");
const { v4: uuidv4 } = require("uuid");

// Create a new loan
const createLoan = async (req, res) => {
  try {
    const { bookId, userId } = req.body;
    if (!bookId)
      return res.status(400).json({ message: "Book ID is required" });

    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: "Book not found" });

    if (book.availableCopies < 1)
      return res.status(400).json({ message: "No available copies" });

    // Use provided userId (admin issuing to user) or req.user._id (student borrowing)
    const targetUserId = userId || req.user._id;
    
    // Verify the target user exists
    const targetUser = await User.findById(targetUserId);
    if (!targetUser) return res.status(404).json({ message: "User not found" });

    // Calculate due date
    const loanDuration = parseInt(process.env.LOAN_DURATION_DAYS) || 14;
    const borrowDate = new Date();
    const dueDate = new Date(borrowDate);
    dueDate.setDate(dueDate.getDate() + loanDuration);

    const newLoan = await Loan.create({
      loanId: uuidv4(),
      userId: targetUserId,
      bookId: book._id,
      borrowDate,
      dueDate,
      status: "borrowed",
    });

    // Decrement available copies
    book.availableCopies -= 1;
    await book.save();

    // Update user's borrowed books
    await User.findByIdAndUpdate(targetUserId, {
      $addToSet: { borrowedBooks: book._id },
    });

    res.status(201).json({
      message: "Book borrowed successfully",
      loan: newLoan,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Mark a loan as returned
const markAsReturned = async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.id).populate("bookId", "title");
    if (!loan) return res.status(404).json({ message: "Loan not found" });

    if (loan.status === "returned")
      return res.status(400).json({ message: "Already returned" });

    const book = await Book.findById(loan.bookId);
    if (!book) return res.status(404).json({ message: "Book not found" });

    const returnDate = new Date();
    loan.status = "returned";
    loan.returnDate = returnDate;

    // Calculate late fee if overdue
    let lateFee = 0;
    let payment = null;

    if (returnDate > loan.dueDate) {
      const daysOverdue = Math.ceil(
        (returnDate - loan.dueDate) / (1000 * 60 * 60 * 24)
      );
      const feePerDay = parseInt(process.env.LATE_FEE_PER_DAY) || 50;
      lateFee = daysOverdue * feePerDay;

      // Create a payment record
      payment = await Payment.create({
        userId: loan.userId,
        amount: lateFee,
        paymentType: "late_fee",
        description: `Late fee for "${book.title}" (${daysOverdue} days overdue)`,
        relatedLoan: loan._id,
        status: "pending",
        transactionId: `TXN-${uuidv4()}`,
        dueDate: returnDate,
      });
    }

    // Save loan and update book
    await loan.save();

    book.availableCopies += 1;
    await book.save();

    await User.findByIdAndUpdate(loan.userId, {
      $pull: { borrowedBooks: loan.bookId },
    });

    res.status(200).json({
      message: "Book returned successfully",
      loan,
      lateFee,
      daysOverdue: lateFee > 0 ? Math.ceil((returnDate - loan.dueDate) / (1000 * 60 * 60 * 24)) : 0,
      payment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all loans of the logged-in user
const getUserLoans = async (req, res) => {
  try {
    const loans = await Loan.find({ userId: req.user._id })
      .populate("bookId", "title author isbn")
      .sort({ borrowDate: -1 });
    res.status(200).json(loans);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all loans (admin)
const getAllLoans = async (req, res) => {
  try {
    const loans = await Loan.find()
      .populate("bookId", "title author")
      .populate("userId", "name email")
      .sort({ borrowDate: -1 });
    res.status(200).json(loans);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createLoan,
  markAsReturned,
  getUserLoans,
  getAllLoans,
};