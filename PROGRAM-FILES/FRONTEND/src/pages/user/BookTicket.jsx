import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getRouteById } from "../../api/routes";
import { bookTicket } from "../../api/tickets";
import toast from "react-hot-toast";

const BookTicket = () => {
  const { routeId } = useParams();
  const navigate = useNavigate();
  const [route, setRoute] = useState(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [formData, setFormData] = useState({
    passengerName: "",
    passengerAge: "",
    passengerGender: "male",
    travelDate: "",
    numberOfSeats: 1,
  });

  useEffect(() => {
    fetchRoute();
  }, [routeId]);

  const fetchRoute = async () => {
    try {
      const data = await getRouteById(routeId);
      setRoute(data);
    } catch (error) {
      toast.error("Failed to fetch route details");
      navigate("/search");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to book ticket");
      navigate("/login");
      return;
    }

    setBooking(true);
    try {
      const ticketData = {
        routeId,
        ...formData,
      };
      const ticket = await bookTicket(ticketData, token);
      toast.success("Ticket booked successfully!");
      navigate("/my-tickets");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to book ticket");
    } finally {
      setBooking(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  const totalFare = route ? route.fare * formData.numberOfSeats : 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Book Ticket
        </h1>

        {/* Route Details */}
        {route && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Route Details
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Train/Bus</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {route.train.name} ({route.train.number})
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Route</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {route.source} → {route.destination}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Departure</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {route.departureTime}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Arrival</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {route.arrivalTime}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Fare per seat</p>
                <p className="font-medium text-gray-900 dark:text-white">₹{route.fare}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Available Seats</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {route.availableSeats}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Booking Form */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Passenger Details
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Passenger Name *
              </label>
              <input
                type="text"
                name="passengerName"
                value={formData.passengerName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Age *
                </label>
                <input
                  type="number"
                  name="passengerAge"
                  value={formData.passengerAge}
                  onChange={handleChange}
                  required
                  min="1"
                  max="120"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Gender *
                </label>
                <select
                  name="passengerGender"
                  value={formData.passengerGender}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Travel Date *
                </label>
                <input
                  type="date"
                  name="travelDate"
                  value={formData.travelDate}
                  onChange={handleChange}
                  required
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Number of Seats *
                </label>
                <input
                  type="number"
                  name="numberOfSeats"
                  value={formData.numberOfSeats}
                  onChange={handleChange}
                  required
                  min="1"
                  max={route?.availableSeats || 1}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            {/* Total Fare */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium text-gray-900 dark:text-white">
                  Total Fare:
                </span>
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  ₹{totalFare}
                </span>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => navigate("/search")}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={booking}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition disabled:opacity-50"
              >
                {booking ? "Booking..." : "Confirm Booking"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookTicket;
