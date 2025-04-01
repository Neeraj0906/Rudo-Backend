require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRoutes = require("./src/routes/authRoutes");
const loginRoutes = require("./src/routes/login"); // Import login routes
const registerRoutes = require("./src/routes/register"); // Import register routes
const stockRoutes = require("./src/routes/stockRoutes");
const portfolioRoutes = require("./src/routes/portfolioRoutes");
const leaderboardRoutes = require('./src/routes/leaderboardRoutes');
const cron = require("node-cron");
const updateStockPrices = require("./src/utils/stockUtils");

const app = express();
const PORT = process.env.PORT || 5000; // Default to port 5000 for local development
const MONGO_URI = process.env.MONGO_URI;

// Middleware
app.use(express.json());
app.use(cookieParser());

// CORS Configuration
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173"; // Fallback to localhost for local development
app.use(
  cors({
    origin: [FRONTEND_URL, "http://localhost:5173"], // Allow both production and development origins
    credentials: true,
  })
);

// Routes
app.use("/api/auth", authRoutes); // General authentication routes
app.use("/api/auth", loginRoutes); // Login-specific routes
app.use("/api/auth", registerRoutes); // Registration-specific routes
app.use("/api/stocks", stockRoutes);
app.use("/api/portfolio", portfolioRoutes);
app.use('/api', leaderboardRoutes);

// Database Connection
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Schedule stock price updates every minute
cron.schedule("*/1 * * * *", async () => {
  console.log("⏳ Updating stock prices...");
  await updateStockPrices();
});

// Root Route (Default Response)
app.get('/', (req, res) => {
  res.send('Server is running...');
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});