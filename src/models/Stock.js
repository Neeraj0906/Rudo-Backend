const mongoose = require('mongoose');

const StockSchema = new mongoose.Schema({
  symbol: { type: String, required: true, unique: true }, // Stock symbol (e.g., AAPL, TSLA)
  currentPrice: { type: Number, required: true }, // Current stock price
  historicalPrices: [
    {
      price: { type: Number, required: true },
      timestamp: { type: Date, default: Date.now },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Stock', StockSchema);