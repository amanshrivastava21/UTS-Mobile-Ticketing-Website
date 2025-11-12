import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { searchRoutes } from "../../api/routes";
import toast from "react-hot-toast";

const SearchTickets = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    source: "",
    destination: "",
  });
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!formData.source || !formData.destination) {
      toast.error("Please enter both source and destination");
      return;
    }

    setLoading(true);
    try {
      const data = await searchRoutes(formData.source, formData.destination);
      setRoutes(data);
      if (data.length === 0) {
        toast.info("No routes found for this search");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to search routes");
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = (routeId) => {
    navigate(`/book-ticket/${routeId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Search Tickets
        </h1>

        {/* Search Form */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <form onSubmit={handleSearch} className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                From (Source)
              </label>
              <input
                type="text"
                name="source"
                value={formData.source}
                onChange={handleChange}
                placeholder="Enter source city"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                To (Destination)
              </label>
              <input
                type="text"
                name="destination"
                value={formData.destination}
                onChange={handleChange}
                placeholder="Enter destination city"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition disabled:opacity-50"
              >
                {loading ? "Searching..." : "Search"}
              </button>
            </div>
          </form>
        </div>

        {/* Search Results */}
        {routes.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Available Routes ({routes.length})
            </h2>
            {routes.map((route) => (
              <div
                key={route._id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition"
              >
                <div className="grid md:grid-cols-4 gap-4">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                      {route.train.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {route.train.number} • {route.train.type.toUpperCase()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Route</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {route.source} → {route.destination}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Timing</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {route.departureTime} - {route.arrivalTime}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Duration: {route.duration}
                    </p>
                  </div>
                  <div className="flex flex-col justify-between items-end">
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        ₹{route.fare}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {route.availableSeats} seats available
                      </p>
                    </div>
                    <button
                      onClick={() => handleBookNow(route._id)}
                      className="mt-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg transition"
                    >
                      Book Now
                    </button>
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

export default SearchTickets;
