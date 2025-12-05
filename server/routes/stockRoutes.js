import express from "express";
import Stock from "../models/Stock.js";

import { fetchStockData } from "../utils/fetchStockData.js";


const router = express.Router();

// GET /stocks - get all stocks
router.get("/", async (req, res) => {
  try {
    const stocks = await Stock.find();
    res.json(stocks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /stocks - add a new stock
router.post("/", async (req, res) => {
  const { symbol, price } = req.body;
  const stock = new Stock({ symbol, price });

  try {
    const newStock = await stock.save();
    res.status(201).json(newStock);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /stocks/:id - remove a stock
router.delete("/:id", async (req, res) => {
  try {
    const deletedStock = await Stock.findByIdAndDelete(req.params.id);
    if (!deletedStock) return res.status(404).json({ message: "Stock not found" });
    res.json({ message: "Stock deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ================== TOP GAINERS ===================

router.get("/top-gainers", async (req, res) => {
  try {
    const symbols = ["AAPL","MSFT","GOOG","AMZN","TSLA","NVDA","META","NFLX","AMD","INTC"];

    // fetch all stock data in parallel
    const stockDataArray = await Promise.all(symbols.map(symbol => fetchStockData(symbol)));

    // sort by percentChange descending
    const topGainers = stockDataArray
      .sort((a, b) => b.percentChange - a.percentChange)
      .slice(0, 10); // top 10

    res.json(topGainers);
  } catch (err) {
    console.error("Error fetching top gainers:", err.message);
    res.status(500).json({ error: "Failed to fetch top gainers" });
  }
});


export default router;
