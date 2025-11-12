# Ticket Booking System

A simple web-based ticket booking system for trains and buses. Users can search routes, book tickets, and manage their bookings. Admins can manage trains, routes, and view all bookings.

## Features

### User Features
- ✅ User registration and login
- ✅ Search trains/buses by source and destination
- ✅ View route details and fares
- ✅ Book tickets with passenger details
- ✅ Generate unique ticket ID
- ✅ View all booked tickets
- ✅ Cancel tickets

### Admin Features
- ✅ Admin dashboard with statistics
- ✅ Manage trains/buses (Add, Edit, Delete)
- ✅ Manage routes (Add, Edit, Delete)
- ✅ View all tickets
- ✅ Track revenue and bookings

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- bcryptjs for password hashing

### Frontend
- React.js
- React Router
- Axios
- Tailwind CSS
- React Hot Toast

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. Navigate to the BACKEND folder:
```bash
cd BACKEND
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the BACKEND folder:
```env
PORT=5000
CONNECTION_STRING=mongodb://localhost:27017/ticketbooking
JWT_SECRET=your_jwt_secret_key_here
```

4. Start the backend server:
```bash
npm start
# or for development with nodemon
npm run dev
```

The backend will run on http://localhost:5000

### Frontend Setup

1. Navigate to the FRONTEND folder:
```bash
cd FRONTEND
```

2. Install dependencies:
```bash
npm install
```

3. Update the API base URL in `src/axiosConfig.js` if needed (default: http://localhost:5000)

4. Start the frontend development server:
```bash
npm run dev
```

The frontend will run on http://localhost:5173 (or another port if 5173 is busy)

## Default Admin Credentials

- **Email:** admin@gmail.com
- **Password:** admin123

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user
- GET `/api/auth/current` - Get current user (Protected)

### Trains/Buses
- GET `/api/trains` - Get all trains
- GET `/api/trains/:id` - Get train by ID
- POST `/api/trains` - Create train (Admin only)
- PUT `/api/trains/:id` - Update train (Admin only)
- DELETE `/api/trains/:id` - Delete train (Admin only)

### Routes
- GET `/api/routes` - Get all routes
- GET `/api/routes/search?source=X&destination=Y` - Search routes
- GET `/api/routes/:id` - Get route by ID
- POST `/api/routes` - Create route (Admin only)
- PUT `/api/routes/:id` - Update route (Admin only)
- DELETE `/api/routes/:id` - Delete route (Admin only)

### Tickets
- POST `/api/tickets` - Book ticket (Protected)
- GET `/api/tickets/my-tickets` - Get user's tickets (Protected)
- GET `/api/tickets/:id` - Get ticket by ID (Protected)
- PUT `/api/tickets/:id/cancel` - Cancel ticket (Protected)
- GET `/api/tickets/admin/all` - Get all tickets (Admin only)
- GET `/api/tickets/admin/stats` - Get ticket statistics (Admin only)

## Usage

### For Users

1. **Register/Login:**
   - Create an account or login with existing credentials
   - Select "User" role during registration/login

2. **Search Tickets:**
   - Go to "Search Tickets" page
   - Enter source and destination
   - View available routes with fares and timings

3. **Book Ticket:**
   - Click "Book Now" on desired route
   - Fill passenger details (name, age, gender)
   - Select travel date and number of seats
   - Confirm booking to get ticket ID

4. **Manage Tickets:**
   - View all your tickets in "My Tickets"
   - Filter by status (all, booked, cancelled, completed)
   - Cancel tickets if needed

### For Admins

1. **Login as Admin:**
   - Use admin credentials (admin@gmail.com / admin123)
   - Select "Admin" role during login

2. **Dashboard:**
   - View statistics (total tickets, revenue, etc.)
   - Quick access to manage trains, routes, and tickets

3. **Manage Trains/Buses:**
   - Add new trains/buses with details
   - Edit existing vehicles
   - Delete vehicles

4. **Manage Routes:**
   - Create new routes with train, source, destination
   - Set departure/arrival times, duration, and fare
   - Edit or delete routes

5. **View All Tickets:**
   - Monitor all bookings
   - Filter by status
   - Track passenger details and revenue

## Database Models

### User
- name, email, password
- role (user/admin)
- phone, profilePic
- bookedTickets (references)

### Train
- name, number
- type (train/bus)
- totalSeats
- status (active/inactive/maintenance)

### Route
- train (reference)
- source, destination
- departureTime, arrivalTime, duration
- fare, availableSeats
- daysOfOperation
- status (active/cancelled/delayed)

### Ticket
- ticketId (auto-generated)
- user, route (references)
- passengerName, passengerAge, passengerGender
- travelDate, numberOfSeats, totalFare
- status (booked/cancelled/completed)
- paymentStatus (pending/paid/refunded)

## Project Structure

```
BACKEND/
├── config/         # Database configuration
├── controllers/    # Request handlers
├── middleware/     # Authentication middleware
├── models/         # Mongoose schemas
├── routes/         # API routes
├── utils/          # Helper functions
└── server.js       # Entry point

FRONTEND/
├── src/
│   ├── api/        # API service functions
│   ├── components/ # Reusable components
│   ├── pages/      # Page components
│   │   ├── user/   # User pages
│   │   └── admin/  # Admin pages
│   ├── context/    # React context
│   └── App.jsx     # Main app component
└── public/         # Static assets
```

## Contributing

Feel free to submit issues and pull requests!

## License

This project is open source and available under the MIT License.
