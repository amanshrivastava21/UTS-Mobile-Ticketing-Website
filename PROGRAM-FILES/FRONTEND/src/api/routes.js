import axios from "../axiosConfig";

// Search routes
export const searchRoutes = async (source, destination) => {
  const response = await axios.get(`/api/routes/search?source=${source}&destination=${destination}`);
  return response.data;
};

// Get all routes
export const getAllRoutes = async () => {
  const response = await axios.get("/api/routes");
  return response.data;
};

// Get route by ID
export const getRouteById = async (id) => {
  const response = await axios.get(`/api/routes/${id}`);
  return response.data;
};

// Create route (admin)
export const createRoute = async (routeData, token) => {
  const response = await axios.post("/api/routes", routeData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Update route (admin)
export const updateRoute = async (id, routeData, token) => {
  const response = await axios.put(`/api/routes/${id}`, routeData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Delete route (admin)
export const deleteRoute = async (id, token) => {
  const response = await axios.delete(`/api/routes/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
