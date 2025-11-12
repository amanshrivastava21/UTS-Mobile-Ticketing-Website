import axios from "../axiosConfig";

// Get all trains
export const getAllTrains = async () => {
  const response = await axios.get("/api/trains");
  return response.data;
};

// Get train by ID
export const getTrainById = async (id) => {
  const response = await axios.get(`/api/trains/${id}`);
  return response.data;
};

// Create train (admin)
export const createTrain = async (trainData, token) => {
  const response = await axios.post("/api/trains", trainData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Update train (admin)
export const updateTrain = async (id, trainData, token) => {
  const response = await axios.put(`/api/trains/${id}`, trainData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Delete train (admin)
export const deleteTrain = async (id, token) => {
  const response = await axios.delete(`/api/trains/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
