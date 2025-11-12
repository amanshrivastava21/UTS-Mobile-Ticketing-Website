import axios from "../axiosConfig";

// Book ticket
export const bookTicket = async (ticketData, token) => {
  const response = await axios.post("/api/tickets", ticketData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Get my tickets
export const getMyTickets = async (token) => {
  const response = await axios.get("/api/tickets/my-tickets", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Get all tickets (admin)
export const getAllTickets = async (token) => {
  const response = await axios.get("/api/tickets/admin/all", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Get ticket by ID
export const getTicketById = async (id, token) => {
  const response = await axios.get(`/api/tickets/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Cancel ticket
export const cancelTicket = async (id, token) => {
  const response = await axios.put(`/api/tickets/${id}/cancel`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Get ticket stats (admin)
export const getTicketStats = async (token) => {
  const response = await axios.get("/api/tickets/admin/stats", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
