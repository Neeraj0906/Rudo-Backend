const User = require('../models/User');
const Stock = require('../models/Stock');
const Order = require('../models/Order');
const jwt = require('jsonwebtoken');

exports.authenticateUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.userId);
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: 'Unauthorized' });
  }
};

// Place a BUY order
exports.buyStock = async (req, res) => {
  try {
    const { userId, stockSymbol, quantity } = req.body;

    // Fetch the user and stock from the database
    const user = await User.findById(userId);
    const stock = await Stock.findOne({ symbol: stockSymbol });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!stock) {
      return res.status(404).json({ message: 'Stock not found' });
    }

    // Calculate the total cost
    const totalCost = stock.currentPrice * quantity;

    // Check if the user has sufficient wallet balance
    if (user.walletBalance < totalCost) {
      return res.status(400).json({ message: 'Insufficient wallet balance' });
    }

    // Deduct the cost from the user's wallet balance
    user.walletBalance -= totalCost;

    // Add the purchased stocks to the user's portfolio
    const portfolioItem = user.portfolio.find((item) => item.stockId.equals(stock._id));
    if (portfolioItem) {
      // If the stock already exists in the portfolio, update the quantity
      portfolioItem.quantity += quantity;
    } else {
      // Otherwise, add a new entry to the portfolio
      user.portfolio.push({
        stockId: stock._id,
        quantity: quantity,
      });
    }

    // Save the updated user
    await user.save();

    // Record the order in the Order collection
    const order = new Order({
      userId: user._id,
      stockId: stock._id,
      type: 'BUY',
      quantity: quantity,
      price: stock.currentPrice,
      status: 'EXECUTED',
    });

    await order.save();

    res.status(200).json({ message: 'BUY order executed successfully', order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Place a SELL order
exports.sellStock = async (req, res) => {
  try {
    const { userId, stockSymbol, quantity } = req.body;

    // Fetch the user and stock from the database
    const user = await User.findById(userId);
    const stock = await Stock.findOne({ symbol: stockSymbol });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!stock) {
      return res.status(404).json({ message: 'Stock not found' });
    }

    // Find the stock in the user's portfolio
    const portfolioItem = user.portfolio.find((item) => item.stockId.equals(stock._id));

    if (!portfolioItem || portfolioItem.quantity < quantity) {
      return res.status(400).json({ message: 'Insufficient shares to sell' });
    }

    // Calculate the total proceeds
    const totalProceeds = stock.currentPrice * quantity;

    // Add the proceeds to the user's wallet balance
    user.walletBalance += totalProceeds;

    // Remove the sold shares from the user's portfolio
    portfolioItem.quantity -= quantity;
    if (portfolioItem.quantity === 0) {
      user.portfolio = user.portfolio.filter((item) => !item.stockId.equals(stock._id));
    }

    // Save the updated user
    await user.save();

    // Record the order in the Order collection
    const order = new Order({
      userId: user._id,
      stockId: stock._id,
      type: 'SELL',
      quantity: quantity,
      price: stock.currentPrice,
      status: 'EXECUTED',
    });

    await order.save();

    res.status(200).json({ message: 'SELL order executed successfully', order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get user's portfolio
exports.getPortfolio = async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch the user from the database
    const user = await User.findById(userId).populate('portfolio.stockId');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Calculate the total portfolio value
    let totalPortfolioValue = 0;
    const portfolioDetails = user.portfolio
      .filter((item) => item.stockId !== null) // Skip invalid stock references
      .map((item) => {
        const stock = item.stockId;
        const currentValue = stock.currentPrice * item.quantity;
        totalPortfolioValue += currentValue;

        return {
          stockSymbol: stock.symbol,
          quantity: item.quantity,
          currentPrice: stock.currentPrice,
          totalValue: currentValue,
        };
      });

    res.status(200).json({
      message: 'Portfolio fetched successfully',
      portfolio: portfolioDetails || [], // Ensure portfolio is always an array
      totalPortfolioValue,
      walletBalance: user.walletBalance, // Include wallet balance in the response
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get leaderboard
exports.getLeaderboard = async (req, res) => {
  try {
    // Fetch all users and populate their portfolios
    const users = await User.find().populate('portfolio.stockId');

    // Calculate portfolio values for each user
    const leaderboard = users.map((user) => {
      let totalPortfolioValue = 0;

      // Ensure portfolio exists and has valid stock data
      if (user.portfolio && user.portfolio.length > 0) {
        user.portfolio.forEach((item) => {
          if (item.stockId && item.stockId.currentPrice) {
            totalPortfolioValue += item.stockId.currentPrice * item.quantity;
          }
        });
      }

      return {
        username: user.username,
        walletBalance: user.walletBalance || 0,
        totalPortfolioValue,
        totalNetWorth: (user.walletBalance || 0) + totalPortfolioValue,
      };
    });

    // Sort users by total net worth (descending)
    leaderboard.sort((a, b) => b.totalNetWorth - a.totalNetWorth);

    res.status(200).json({
      message: 'Leaderboard fetched successfully',
      leaderboard,
    });
  } catch (err) {
    console.error("🚨 Error in getLeaderboard:", err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

