# 🚀 Quick Start Guide

## Prerequisites
- Node.js installed (v14+)
- MongoDB installed and running OR MongoDB Atlas account

## Step 1: Setup Backend

1. Open PowerShell and navigate to the BACKEND folder:
```powershell
cd "c:\Users\super\Desktop\UTS MOBILE TICKET WEBSITE\PROGRAM-FILES\BACKEND"
```

2. Install dependencies:
```powershell
npm install
```

3. Create `.env` file:
```powershell
Copy-Item .env.example .env
```

4. Edit the `.env` file with your settings:
```env
PORT=5000
CONNECTION_STRING=mongodb://localhost:27017/ticketbooking
JWT_SECRET=my_super_secret_jwt_key_12345
```

5. Start the backend server:
```powershell
npm start
```

You should see:
```
✅ Database connected: localhost/ticketbooking
✅ Default admin created (or already exists)
🚀 Server running on port 5000
```

## Step 2: Setup Frontend

1. Open a NEW PowerShell window and navigate to the FRONTEND folder:
```powershell
cd "c:\Users\super\Desktop\UTS MOBILE TICKET WEBSITE\PROGRAM-FILES\FRONTEND"
```

2. Install dependencies:
```powershell
npm install
```

3. (Optional) Create `.env` file:
```powershell
Copy-Item .env.example .env
```

4. Start the frontend development server:
```powershell
npm run dev
```

You should see:
```
  VITE ready in XXX ms
  ➜  Local:   http://localhost:5173/
```

## Step 3: Access the Application

1. Open your browser and go to: **http://localhost:5173**

2. You'll see the home page with options to:
   - **Sign Up** - Create a new user account
   - **Sign In** - Login to existing account

## Step 4: Test as Admin

1. Click **Sign In**
2. Select **Login as Admin**
3. Enter credentials:
   - Email: `admin@gmail.com`
   - Password: `admin123`
4. You'll be redirected to the Admin Dashboard

### Admin Actions:
- **Manage Trains/Buses**: Add trains like "Express 101", "Metro Bus 45"
- **Manage Routes**: Create routes with source, destination, timings, and fare
- **View All Tickets**: Monitor all bookings
- **Dashboard**: See statistics and revenue

## Step 5: Test as User

1. Click **Sign Up** or **Sign In**
2. Create a new account or login
3. Select **Login as User**

### User Actions:
- **Search Tickets**: Enter source and destination to find routes
- **Book Ticket**: Fill passenger details and book
- **My Tickets**: View and cancel your tickets

## Sample Data to Add (Admin)

### Add a Train:
- Name: Express 2001
- Number: EXP2001
- Type: Train
- Total Seats: 100
- Status: Active

### Add a Route:
- Train: Express 2001
- Source: Mumbai
- Destination: Delhi
- Departure Time: 08:00
- Arrival Time: 20:00
- Duration: 12h 00m
- Fare: 1500

Now users can search for "Mumbai" to "Delhi" and book tickets!

## Troubleshooting

### Backend won't start:
- Make sure MongoDB is running
- Check if port 5000 is not in use
- Verify `.env` file exists with correct settings

### Frontend won't start:
- Make sure backend is running first
- Check if port 5173 is available
- Clear node_modules and reinstall: `rm -r node_modules; npm install`

### Can't connect to backend:
- Verify backend is running on http://localhost:5000
- Check FRONTEND/.env has `VITE_APP_BACKEND_URL=http://localhost:5000`
- Try opening http://localhost:5000/api/ping in browser

## PowerShell Commands Quick Reference

```powershell
# Navigate to folder
cd "path\to\folder"

# Install packages
npm install

# Start development server
npm run dev

# Start production server
npm start

# Stop server
Ctrl + C

# Check if MongoDB is running
Get-Process mongod

# Start MongoDB (if installed locally)
mongod --dbpath "C:\data\db"
```

## Next Steps

1. ✅ Create some trains and routes as admin
2. ✅ Register a user account
3. ✅ Search and book tickets
4. ✅ Explore the admin dashboard
5. ✅ Try cancelling a ticket

## Support

If you encounter any issues:
1. Check that both backend and frontend are running
2. Verify MongoDB is connected
3. Check browser console for errors (F12)
4. Check terminal for server errors

Happy ticket booking! 🎫
