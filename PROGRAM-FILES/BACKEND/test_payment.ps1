# Payment System Quick Test Script
# Run this in PowerShell after starting your backend server

Write-Host "🧪 Library Management System - Payment Testing" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:5000"

# Test 1: Check if backend is running
Write-Host "📡 Step 1: Checking backend connection..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/api/books" -Method GET -ErrorAction Stop
    Write-Host "✅ Backend is running!" -ForegroundColor Green
} catch {
    Write-Host "❌ Backend is not running!" -ForegroundColor Red
    Write-Host "Please start backend: cd BACKEND && npm run dev" -ForegroundColor Yellow
    exit
}

Write-Host ""
Write-Host "🔐 Step 2: Login as Admin" -ForegroundColor Yellow
$loginBody = @{
    email = "admin@gmail.com"
    password = "admin123"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/api/auth/login" -Method POST -Body $loginBody -ContentType "application/json"
    $adminToken = $loginResponse.token
    Write-Host "✅ Admin login successful!" -ForegroundColor Green
    Write-Host "   Token: $($adminToken.Substring(0, 20))..." -ForegroundColor Gray
} catch {
    Write-Host "❌ Admin login failed!" -ForegroundColor Red
    exit
}

Write-Host ""
Write-Host "📚 Step 3: Fetching all loans..." -ForegroundColor Yellow
try {
    $headers = @{
        "Authorization" = "Bearer $adminToken"
    }
    $loans = Invoke-RestMethod -Uri "$baseUrl/api/loans" -Method GET -Headers $headers
    $borrowedLoans = $loans | Where-Object { $_.status -eq "borrowed" }
    
    Write-Host "✅ Total Loans: $($loans.Count)" -ForegroundColor Green
    Write-Host "   Active (Borrowed): $($borrowedLoans.Count)" -ForegroundColor Cyan
    
    if ($borrowedLoans.Count -eq 0) {
        Write-Host ""
        Write-Host "⚠️  No active loans found!" -ForegroundColor Yellow
        Write-Host "   Please borrow a book first:" -ForegroundColor Yellow
        Write-Host "   1. Login as student in browser" -ForegroundColor Gray
        Write-Host "   2. Go to Book Catalog tab" -ForegroundColor Gray
        Write-Host "   3. Click 'Borrow' on any book" -ForegroundColor Gray
        Write-Host "   4. Run this script again" -ForegroundColor Gray
    } else {
        Write-Host ""
        Write-Host "📋 Active Loans:" -ForegroundColor Cyan
        foreach ($loan in $borrowedLoans | Select-Object -First 3) {
            Write-Host "   • Book: $($loan.bookId.title)" -ForegroundColor Gray
            Write-Host "     Due: $($loan.dueDate)" -ForegroundColor Gray
            Write-Host "     Loan ID: $($loan._id)" -ForegroundColor Gray
            Write-Host ""
        }
    }
} catch {
    Write-Host "❌ Failed to fetch loans: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "💰 Step 4: Checking payments..." -ForegroundColor Yellow
try {
    $payments = Invoke-RestMethod -Uri "$baseUrl/api/payments" -Method GET -Headers $headers
    $pendingPayments = $payments | Where-Object { $_.status -eq "pending" }
    
    Write-Host "✅ Total Payments: $($payments.Count)" -ForegroundColor Green
    Write-Host "   Pending: $($pendingPayments.Count)" -ForegroundColor Yellow
    Write-Host "   Completed: $(($payments | Where-Object { $_.status -eq 'completed' }).Count)" -ForegroundColor Green
    
    if ($pendingPayments.Count -gt 0) {
        Write-Host ""
        Write-Host "⚠️  Pending Payments:" -ForegroundColor Yellow
        foreach ($payment in $pendingPayments | Select-Object -First 5) {
            Write-Host "   • Amount: ₹$($payment.amount)" -ForegroundColor Red
            Write-Host "     User: $($payment.userId.email)" -ForegroundColor Gray
            Write-Host "     Type: $($payment.paymentType)" -ForegroundColor Gray
            Write-Host "     Description: $($payment.description)" -ForegroundColor Gray
            Write-Host ""
        }
    }
} catch {
    Write-Host "❌ Failed to fetch payments: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "🎯 QUICK TESTING GUIDE" -ForegroundColor Cyan
Write-Host "════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "Method 1: MongoDB Update (Fastest)" -ForegroundColor Yellow
Write-Host "--------------------------------" -ForegroundColor Gray
Write-Host "1. Open MongoDB Compass" -ForegroundColor White
Write-Host "2. Connect to your database" -ForegroundColor White
Write-Host "3. Go to 'loans' collection" -ForegroundColor White
Write-Host "4. Find a loan with status: 'borrowed'" -ForegroundColor White
Write-Host "5. Edit the document" -ForegroundColor White
Write-Host "6. Change 'dueDate' to past date (e.g., 2025-10-01)" -ForegroundColor White
Write-Host "7. Save changes" -ForegroundColor White
Write-Host "8. Return the book from admin dashboard" -ForegroundColor White
Write-Host "9. Check student's Payments tab!" -ForegroundColor White
Write-Host ""

Write-Host "Method 2: Run MongoDB Script" -ForegroundColor Yellow
Write-Host "----------------------------" -ForegroundColor Gray
Write-Host "mongosh < test_payment.js" -ForegroundColor Cyan
Write-Host ""

Write-Host "Method 3: Change .env (Temporary)" -ForegroundColor Yellow
Write-Host "----------------------------------" -ForegroundColor Gray
Write-Host "LOAN_DURATION_DAYS=0  # Books due immediately" -ForegroundColor Cyan
Write-Host "LATE_FEE_PER_DAY=50   # Higher fee" -ForegroundColor Cyan
Write-Host "Then restart backend and borrow a book!" -ForegroundColor White
Write-Host ""

Write-Host "════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "✨ Script completed!" -ForegroundColor Green
Write-Host "📖 See TEST_PAYMENT_GUIDE.md for detailed instructions" -ForegroundColor Cyan
