const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the user
  stockId: { type: mongoose.Schema.Types.ObjectId, ref: 'Stock', required: true }, // Reference to the stock
  type: { type: String, enum: ['BUY', 'SELL'], required: true }, // Order type
  quantity: { type: Number, required: true }, // Quantity of stocks
  price: { type: Number, required: true }, // Price per stock
  status: { type: String, enum: ['PENDING', 'EXECUTED'], default: 'PENDING' }, // Order status
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Order', OrderSchema);