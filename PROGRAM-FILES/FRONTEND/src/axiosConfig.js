// src/axiosConfig.js
import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_APP_BACKEND_URL || "http://localhost:5000", // From backend or default
  withCredentials: true, // Allow cookies if backend uses them
});

// Add request interceptor to automatically include token from localStorage
instance.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem("token");
    
    // If token exists, add it to Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token expiration
instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // If token is invalid or expired, clear localStorage and redirect to login
    if (error.response && error.response.status === 401) {
      const currentPath = window.location.pathname;
      // Only clear and redirect if not already on login/register pages
      if (currentPath !== "/login" && currentPath !== "/register" && currentPath !== "/") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default instance;