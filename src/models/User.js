const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  walletBalance: { type: Number, default: 100000 }, // Default wallet balance
  portfolio: [
    {
      stockId: { type: mongoose.Schema.Types.ObjectId, ref: 'Stock', required: true }, // Reference to the stock
      quantity: { type: Number, required: true }, // Quantity of stocks owned
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', UserSchema);