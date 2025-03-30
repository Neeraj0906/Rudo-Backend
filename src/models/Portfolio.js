const mongoose = require('mongoose');

const PortfolioSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the user
  stockId: { type: mongoose.Schema.Types.ObjectId, ref: 'Stock', required: true }, // Reference to the stock
  quantity: { type: Number, required: true }, // Quantity of stocks owned
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Portfolio', PortfolioSchema);  