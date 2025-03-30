const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./src/app'); // Import the Express app from app.js
require('./src/utils/stockUtils'); // Initialize the cron job

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});