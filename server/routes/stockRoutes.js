import express from "express";
import Stock from "../models/Stock.js";

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

export default router;
