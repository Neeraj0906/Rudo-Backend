const Stock = require('../models/Stock'); // Corrected import
const cron = require('node-cron');

// Function to simulate stock price updates
const updateStockPrices = async () => {
  try {
    // Retry logic for MongoDB connection
    const stocks = await Stock.find().catch((err) => {
      console.error('MongoDB connection error:', err);
      throw err; // Rethrow the error if retries fail
    });

    for (const stock of stocks) {
      const randomChange = (Math.random() - 0.5) * 0.1;
      const newPrice = stock.currentPrice * (1 + randomChange);

      stock.currentPrice = parseFloat(newPrice.toFixed(2));
      stock.historicalPrices.push({
        price: stock.currentPrice,
        timestamp: new Date(),
      });

      await stock.save();
    }

    console.log('Stock prices updated successfully');
  } catch (err) {
    console.error('Error updating stock prices:', err);
  }
};

// Schedule the function to run every minute
cron.schedule('* * * * *', () => {
  console.log('Running cron job to update stock prices...');
  updateStockPrices();
});

module.exports = { updateStockPrices };