# Ticket Booking System - Setup Script
# Run this script from the PROGRAM-FILES directory

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  Ticket Booking System - Quick Setup" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
Write-Host "Checking prerequisites..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js is installed: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Node.js is not installed. Please install Node.js first." -ForegroundColor Red
    Write-Host "  Download from: https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  Setting up BACKEND..." -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan

# Setup Backend
Set-Location -Path "BACKEND"

Write-Host "Installing backend dependencies..." -ForegroundColor Yellow
npm install

# Create .env file if it doesn't exist
if (-Not (Test-Path ".env")) {
    Write-Host "Creating .env file..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "✓ .env file created. Please edit it with your MongoDB connection string." -ForegroundColor Green
} else {
    Write-Host "✓ .env file already exists" -ForegroundColor Green
}

Write-Host "✓ Backend setup complete!" -ForegroundColor Green

Set-Location -Path ".."

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  Setting up FRONTEND..." -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan

# Setup Frontend
Set-Location -Path "FRONTEND"

Write-Host "Installing frontend dependencies..." -ForegroundColor Yellow
npm install

# Create .env file if it doesn't exist
if (-Not (Test-Path ".env")) {
    Write-Host "Creating .env file..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "✓ .env file created" -ForegroundColor Green
} else {
    Write-Host "✓ .env file already exists" -ForegroundColor Green
}

Write-Host "✓ Frontend setup complete!" -ForegroundColor Green

Set-Location -Path ".."

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  Setup Complete!" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Make sure MongoDB is running" -ForegroundColor White
Write-Host "2. Edit BACKEND/.env with your MongoDB connection" -ForegroundColor White
Write-Host "3. Open two terminal windows:" -ForegroundColor White
Write-Host ""
Write-Host "   Terminal 1 (Backend):" -ForegroundColor Cyan
Write-Host "   cd BACKEND" -ForegroundColor White
Write-Host "   npm start" -ForegroundColor White
Write-Host ""
Write-Host "   Terminal 2 (Frontend):" -ForegroundColor Cyan
Write-Host "   cd FRONTEND" -ForegroundColor White
Write-Host "   npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "4. Open http://localhost:5173 in your browser" -ForegroundColor White
Write-Host ""
Write-Host "Default Admin Login:" -ForegroundColor Yellow
Write-Host "  Email: admin@gmail.com" -ForegroundColor White
Write-Host "  Password: admin123" -ForegroundColor White
Write-Host ""
Write-Host "For detailed instructions, see QUICKSTART.md" -ForegroundColor Cyan
Write-Host ""
