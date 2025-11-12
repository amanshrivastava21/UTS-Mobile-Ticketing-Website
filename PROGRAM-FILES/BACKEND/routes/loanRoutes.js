const express = require("express");
const { createLoan, markAsReturned, getUserLoans, getAllLoans } = require("../controllers/loanController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createLoan);
router.put("/return/:id", protect, markAsReturned);
router.get("/my", protect, getUserLoans);
router.get("/", protect, getAllLoans);

module.exports = router;
