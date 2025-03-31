const express = require('express');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./routes/authRoutes'); // Import authentication routes
const tradeRoutes = require('./routes/tradeRoutes'); // Import trading routes
const Stock = require('./models/Stock'); // Import the Stock model
const User = require('./models/User'); // Import the User model
const helmet = require('helmet');
const app = express();

// Middleware to serve static files (e.g., fonts, CSS, images)
app.use(express.static(path.join(__dirname, 'public')));

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        fontSrc: ["'self'", "data:", "https://fonts.googleapis.com", "https://fonts.gstatic.com"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        connectSrc: ["'self'"],
        imgSrc: ["'self'", "data:"],
      },
    },
  })
);

// Middleware
app.use(express.json()); // Parse JSON requests
// Enable CORS for frontend
app.use(cors({ origin: "*", credentials: true }));
// Middleware to set Content Security Policy (CSP)
app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; font-src 'self' data:; script-src 'self'; style-src 'self';"
  );
  next();
});

// Routes
app.use('/api/auth', authRoutes); // Authentication routes
app.use('/api/trade', tradeRoutes); // Trading routes

// Test route
app.get('/test', (req, res) => {
  res.send('Server is running!');
});

app.get('/', (req, res) => {
  res.send('Server is running fine!');
});

// Seeder route to add initial stocks (TEMPORARY)
app.get('/seed-stocks', async (req, res) => {
  try {
    const stocks = [
      { symbol: "AAPL", currentPrice: 150, historicalPrices: [] },
      { symbol: "TSLA", currentPrice: 250, historicalPrices: [] },
      { symbol: "GOOGL", currentPrice: 2800, historicalPrices: [] },
      { symbol: "MSFT", currentPrice: 300, historicalPrices: [] },
      { symbol: "AMZN", currentPrice: 3400, historicalPrices: [] },
      { symbol: "NFLX", currentPrice: 400, historicalPrices: [] },
      { symbol: "NVDA", currentPrice: 450, historicalPrices: [] },
      { symbol: "META", currentPrice: 320, historicalPrices: [] },
      { symbol: "ADBE", currentPrice: 400, historicalPrices: [] },
      { symbol: "PYPL", currentPrice: 90, historicalPrices: [] },
      { symbol: "INTC", currentPrice: 35, historicalPrices: [] },
      { symbol: "AMD", currentPrice: 120, historicalPrices: [] },
      { symbol: "DIS", currentPrice: 100, historicalPrices: [] },
      { symbol: "BABA", currentPrice: 120, historicalPrices: [] },
      { symbol: "KO", currentPrice: 60, historicalPrices: [] },
    ];

    // Clear existing stocks and users
    await Stock.deleteMany({});
    await User.updateMany({}, { $set: { portfolio: [] } }); // Reset all users' portfolios

    // Insert new stocks
    await Stock.insertMany(stocks);

    res.status(200).json({ message: 'Stocks seeded successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error seeding stocks' });
  }
});

module.exports = app; 