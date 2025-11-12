# Testing Payment System - Quick Guide

## Method 1: Database Manipulation (Fastest)

### Steps:
1. **Borrow a book as a student**
2. **Manually update the due date in MongoDB**

```javascript
// Open MongoDB Compass or use mongosh
db.loans.updateOne(
  { status: "borrowed" },  // Find an active loan
  { $set: { dueDate: new Date("2025-10-01") } }  // Set to past date
)
```

3. **Return the book from admin dashboard**
4. **Check payments** - You'll see late fee automatically created!

---

## Method 2: Temporary Code Change (Development Only)

### Modify `loanController.js` createLoan function:

**Original:**
```javascript
const loanDuration = parseInt(process.env.LOAN_DURATION_DAYS) || 14;
const dueDate = new Date(borrowDate);
dueDate.setDate(dueDate.getDate() + loanDuration);
```

**For Testing (Change to 1 minute):**
```javascript
const dueDate = new Date(borrowDate);
dueDate.setMinutes(dueDate.getMinutes() + 1); // Due in 1 minute!
```

**Steps:**
1. Make the change
2. Restart backend server
3. Borrow a book
4. Wait 1 minute
5. Return the book → See late fee!
6. **REVERT THE CHANGE** after testing

---

## Method 3: Environment Variable (Quick Test)

### Change `.env`:
```env
LOAN_DURATION_DAYS=0  # Books due immediately
LATE_FEE_PER_DAY=50   # Higher fee for visibility
```

**Steps:**
1. Update .env
2. Restart backend
3. Borrow book (instantly overdue!)
4. Return book
5. Check payment created

---

## Method 4: API Testing with Postman/Thunder Client

### Create Payment Manually:
```http
POST http://localhost:5000/api/payments
Authorization: Bearer YOUR_STUDENT_TOKEN
Content-Type: application/json

{
  "amount": 100,
  "paymentType": "late_fee",
  "description": "Test late fee",
  "paymentMethod": "cash"
}
```

### View Payments:
```http
GET http://localhost:5000/api/payments/my
Authorization: Bearer YOUR_STUDENT_TOKEN
```

---

## Method 5: MongoDB Direct Insert

```javascript
// Insert payment directly via MongoDB Compass or mongosh
db.payments.insertOne({
  userId: ObjectId("YOUR_STUDENT_ID"),
  amount: 75,
  paymentType: "late_fee",
  description: "Test late fee for Harry Potter (5 days overdue)",
  status: "pending",
  paymentMethod: "cash",
  transactionId: "TXN-TEST-12345",
  dueDate: new Date(),
  createdAt: new Date(),
  updatedAt: new Date()
})
```

---

## 🎯 RECOMMENDED TESTING FLOW

### **Quick 5-Minute Test:**

1. **Start Both Servers**
   ```bash
   # Backend
   cd BACKEND
   npm run dev
   
   # Frontend
   cd FRONTEND/my-reactt-app
   npm run dev
   ```

2. **Login as Student**
   - Email: (any registered student)
   - Or create new account

3. **Borrow a Book**
   - Go to "Book Catalog" tab
   - Click "Borrow" on any available book

4. **Open MongoDB Compass**
   - Connect to your database
   - Navigate to `loans` collection
   - Find your loan (status: "borrowed")
   - Edit the document
   - Change `dueDate` to: `2025-10-01T00:00:00.000Z` (past date)
   - Save

5. **Login as Admin**
   - Email: admin@gmail.com
   - Password: admin123

6. **Return the Book**
   - Find the loan in "Currently on Borrow"
   - Click "Return"
   - You should see alert: "Book returned! Late Fee: ₹XXX (X days overdue)"

7. **Login as Student Again**
   - Go to "Payments" tab
   - See the pending late fee!

---

## 📊 Expected Results

### After Returning Overdue Book:

**Backend Response:**
```json
{
  "message": "Book returned successfully",
  "lateFee": 100,
  "daysOverdue": 10,
  "payment": {
    "_id": "...",
    "userId": "...",
    "amount": 100,
    "paymentType": "late_fee",
    "description": "Late fee for 'Book Title' (10 days overdue)",
    "status": "pending"
  }
}
```

**Student Dashboard:**
- Red warning: "⚠️ You have 1 pending payment"
- Payments tab shows:
  - Amount: ₹100
  - Description: Late fee for 'Book Title' (10 days overdue)
  - Due date
  - Red "Pending" badge

---

## 🛠️ MongoDB Commands Reference

### View All Loans:
```javascript
db.loans.find({ status: "borrowed" }).pretty()
```

### Set Loan to Overdue:
```javascript
db.loans.updateOne(
  { _id: ObjectId("LOAN_ID") },
  { $set: { dueDate: new Date("2025-10-01") } }
)
```

### View All Payments:
```javascript
db.payments.find().pretty()
```

### Delete Test Payments:
```javascript
db.payments.deleteMany({ description: /Test/ })
```

---

## 🔧 Testing Different Scenarios

### Scenario 1: Small Late Fee (1 day)
```javascript
// Set due date to yesterday
const yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);
db.loans.updateOne({ status: "borrowed" }, { $set: { dueDate: yesterday } })
// Expected: ₹10 late fee (1 day × ₹10)
```

### Scenario 2: Large Late Fee (30 days)
```javascript
// Set due date to 30 days ago
const thirtyDaysAgo = new Date();
thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
db.loans.updateOne({ status: "borrowed" }, { $set: { dueDate: thirtyDaysAgo } })
// Expected: ₹300 late fee (30 days × ₹10)
```

### Scenario 3: Multiple Overdue Books
```javascript
// Update multiple loans
db.loans.updateMany(
  { status: "borrowed" },
  { $set: { dueDate: new Date("2025-10-01") } }
)
// Return each book → Multiple payments created
```

---

## ✅ Verification Checklist

After testing, verify:
- [ ] Late fee calculated correctly (days × rate)
- [ ] Payment created in database
- [ ] Payment visible in student's "Payments" tab
- [ ] Red warning shows pending payment count
- [ ] Payment shows correct description
- [ ] Payment status is "pending"
- [ ] Book's available copies increased by 1
- [ ] Loan status changed to "returned"

---

## 🚨 Important Notes

1. **Don't forget to revert temporary code changes!**
2. **Use Method 1 (DB update) for safest testing**
3. **Clean up test data after testing**
4. **Document any issues found**

---

## 🎓 Pro Tips

- Use MongoDB Compass GUI for easier date editing
- Test with different late fee amounts in .env
- Try marking payment as completed (admin API)
- Test with multiple students
- Verify payment history after marking complete
