import axios from "../axiosConfig";

// Register user
export const register = async (userData) => {
  const response = await axios.post("/api/auth/register", userData);
  return response.data;
};

// Login user
export const login = async (credentials) => {
  const response = await axios.post("/api/auth/login", credentials);
  return response.data;
};

// Get current user
export const getCurrentUser = async (token) => {
  const response = await axios.get("/api/auth/current", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
