import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import ErrorBoundary from "./ErrorBoundary";
import Navbar from "./components/Navbar";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

// User Pages
import SearchTickets from "./pages/user/SearchTickets";
import BookTicket from "./pages/user/BookTicket";
import MyTickets from "./pages/user/MyTickets";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageTrains from "./pages/admin/ManageTrains";
import ManageRoutes from "./pages/admin/ManageRoutes";
import AllTickets from "./pages/admin/AllTickets";

function App() {
  return (
    <>
      {/* Toast notifications */}
      <Toaster position="top-right" />

      <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900 text-black dark:text-gray-100">
        {/* Navbar */}
        <Navbar />
        
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          <ErrorBoundary>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* User Routes */}
              <Route path="/search" element={<SearchTickets />} />
              <Route path="/book-ticket/:routeId" element={<BookTicket />} />
              <Route path="/my-tickets" element={<MyTickets />} />

              {/* Admin Routes */}
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/trains" element={<ManageTrains />} />
              <Route path="/admin/routes" element={<ManageRoutes />} />
              <Route path="/admin/tickets" element={<AllTickets />} />
            </Routes>
          </ErrorBoundary>
        </div>
      </div>
    </>
  );
}

export default App;
