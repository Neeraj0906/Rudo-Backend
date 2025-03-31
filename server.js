  // server.js (Fixed & Optimized)
  require("dotenv").config();
  const express = require("express");
  const mongoose = require("mongoose");
  const cors = require("cors");
  const cookieParser = require("cookie-parser");
  const authRoutes = require("./src/routes/authRoutes");
  const stockRoutes = require("./src/routes/stockRoutes");
  const portfolioRoutes = require("./src/routes/portfolioRoutes");
  const cron = require("node-cron");
  const updateStockPrices = require("./src/utils/stockUtils");
  const leaderboardRoutes = require('./src/routes/leaderboardRoutes'); // ✅ Import leaderboard route

  const app = express();
  const PORT = process.env.PORT || 5000;
  const MONGO_URI = process.env.MONGO_URI;

  // Middleware
  app.use(express.json());
  app.use(cookieParser());
  app.use(
    cors({
      origin: ["http://localhost:3000", "https://rudo-frontend.vercel.app"],
      credentials: true,
    })
  );

  // Routes
  app.use("/api/auth", authRoutes);
  app.use("/api/stocks", stockRoutes);
  app.use("/api/portfolio", portfolioRoutes);
  app.use('/api', leaderboardRoutes); // ✅ Add to routes

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
