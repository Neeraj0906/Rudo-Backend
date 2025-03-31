const Stock = require("../models/Stock");

// Get all stocks
exports.getAllStocks = async (req, res) => {
  try {
    const stocks = await Stock.find();
    res.status(200).json(stocks);
  } catch (err) {
    console.error("Error fetching stocks:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get a specific stock by symbol
exports.getStockBySymbol = async (req, res) => {
  try {
    const { symbol } = req.params;
    const stock = await Stock.findOne({ symbol });

    if (!stock) {
      return res.status(404).json({ message: "Stock not found" });
    }

    res.status(200).json(stock);
  } catch (err) {
    console.error("Error fetching stock:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
