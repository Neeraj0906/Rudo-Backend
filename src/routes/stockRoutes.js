const express = require("express");
const { getAllStocks, getStockBySymbol } = require("../controllers/stockController");

const router = express.Router();

// Route to fetch all stocks
router.get("/", getAllStocks);

// Route to fetch a specific stock by symbol
router.get("/:symbol", getStockBySymbol);

module.exports = router;
