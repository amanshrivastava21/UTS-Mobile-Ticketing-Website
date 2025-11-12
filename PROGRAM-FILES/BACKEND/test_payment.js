// Quick Test Script for Payment System
// Run this in MongoDB Shell (mongosh) or MongoDB Compass

// ========================================
// STEP 1: Find an active loan
// ========================================
const activeLoan = db.loans.findOne({ status: "borrowed" });
print("Active Loan Found:");
printjson(activeLoan);

if (!activeLoan) {
  print("❌ No active loan found. Please borrow a book first!");
  print("Steps:");
  print("1. Login as student");
  print("2. Go to Book Catalog");
  print("3. Click 'Borrow' on any book");
} else {
  print("\n✅ Loan ID: " + activeLoan._id);
  print("📚 Book: " + activeLoan.bookId);
  print("📅 Current Due Date: " + activeLoan.dueDate);
  
  // ========================================
  // STEP 2: Set due date to 10 days ago (instant overdue)
  // ========================================
  const tenDaysAgo = new Date();
  tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);
  
  print("\n🔧 Setting due date to: " + tenDaysAgo);
  
  db.loans.updateOne(
    { _id: activeLoan._id },
    { $set: { dueDate: tenDaysAgo } }
  );
  
  print("✅ Loan updated!");
  print("\n📋 NEXT STEPS:");
  print("1. Login as Admin (admin@gmail.com / admin123)");
  print("2. Find this loan in 'Currently on Borrow'");
  print("3. Click 'Return' button");
  print("4. You should see: 'Late Fee: ₹100 (10 days overdue)'");
  print("5. Login as Student");
  print("6. Go to 'Payments' tab");
  print("7. See the pending payment!");
  
  print("\n💡 Expected Late Fee: ₹100");
  print("   (10 days × ₹10 per day)");
}

// ========================================
// BONUS: View current payments
// ========================================
print("\n\n📊 Current Payments in Database:");
print("================================");
db.payments.find().forEach(payment => {
  print("\n💰 Payment:");
  print("   Amount: ₹" + payment.amount);
  print("   Type: " + payment.paymentType);
  print("   Status: " + payment.status);
  print("   Description: " + payment.description);
});

const pendingCount = db.payments.countDocuments({ status: "pending" });
print("\n⚠️  Total Pending Payments: " + pendingCount);
