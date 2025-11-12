import { useState, useEffect } from "react";
import { getMyTickets, cancelTicket } from "../../api/tickets";
import toast from "react-hot-toast";

const MyTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, booked, cancelled, completed

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to view tickets");
      return;
    }

    try {
      const data = await getMyTickets(token);
      setTickets(data);
    } catch (error) {
      toast.error("Failed to fetch tickets");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelTicket = async (ticketId) => {
    if (!window.confirm("Are you sure you want to cancel this ticket?")) {
      return;
    }

    const token = localStorage.getItem("token");
    try {
      await cancelTicket(ticketId, token);
      toast.success("Ticket cancelled successfully");
      fetchTickets();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to cancel ticket");
    }
  };

  const filteredTickets = tickets.filter((ticket) => {
    if (filter === "all") return true;
    return ticket.status === filter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "booked":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      case "completed":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          My Tickets
        </h1>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {["all", "booked", "cancelled", "completed"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-6 py-2 rounded-lg font-medium capitalize transition ${
                filter === status
                  ? "bg-blue-600 text-white"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Tickets List */}
        {filteredTickets.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-600 dark:text-gray-400">No tickets found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTickets.map((ticket) => (
              <div
                key={ticket._id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Ticket ID: {ticket.ticketId}
                    </h3>
                    <span
                      className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        ticket.status
                      )}`}
                    >
                      {ticket.status.toUpperCase()}
                    </span>
                  </div>
                  {ticket.status === "booked" && (
                    <button
                      onClick={() => handleCancelTicket(ticket._id)}
                      className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition"
                    >
                      Cancel Ticket
                    </button>
                  )}
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Passenger</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {ticket.passengerName}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Age: {ticket.passengerAge} | {ticket.passengerGender}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Route</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {ticket.route.source} → {ticket.route.destination}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {ticket.route.train.name} ({ticket.route.train.number})
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Travel Date</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {new Date(ticket.travelDate).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {ticket.route.departureTime} - {ticket.route.arrivalTime}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Booked on: {new Date(ticket.bookingDate).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Seats: {ticket.numberOfSeats}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      ₹{ticket.totalFare}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {ticket.paymentStatus}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTickets;
