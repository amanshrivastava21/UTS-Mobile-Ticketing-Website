// ... existing imports ...
const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");
const fs = require("fs");
const path = "./uploads";

// Routes import
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const trainRoutes = require("./routes/trainRoutes");
const routeRoutes = require("./routes/routeRoutes");
const ticketRoutes = require("./routes/ticketRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const stripeRoutes = require("./routes/stripeRoutes");

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB().then(() => {
  ensureDefaultAdmin(); // Call after DB is connected
});

// --- Ensure default admin exists ---
const User = require("./models/userModel");
const bcrypt = require("bcryptjs");

async function ensureDefaultAdmin() {
  const adminEmail = "admin@gmail.com";
  const adminPassword = "admin123";
  const adminExists = await User.findOne({ email: adminEmail });
  if (!adminExists) {
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    await User.create({
      name: "Admin",
      email: adminEmail,
      password: hashedPassword,
      role: "admin",
    });
    console.log("✅ Default admin created.");
  } else {
    console.log("ℹ️ Default admin already exists.");
  }
}

const app = express();

// Create 'uploads' folder if it doesn't exist
if (!fs.existsSync(path)) {
  fs.mkdirSync(path, { recursive: true });
}

// Enable CORS with credentials support
app.use(cors({ 
  origin: "http://localhost:5173", // Frontend URL
  credentials: true 
}));

// Middleware to parse JSON request body
app.use(express.json());

// Serve static files for uploads
app.use("/uploads", express.static("uploads"));

// ---------------- Connectivity Check ---------------- //
app.get("/api/ping", (req, res) => {
  console.log("📡 React Native app is connected to the backend server!");
  res.status(200).json({ success: true });
});


// ---------------- API Routes ---------------- //
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/trains", trainRoutes);
app.use("/api/routes", routeRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/payments/stripe", stripeRoutes);

// ---------------- Error Handling ---------------- //
app.use((req, res) => {
  res.status(404).json({ message: "API endpoint not found" });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
