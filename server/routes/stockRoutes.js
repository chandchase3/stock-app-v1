// server/routes/stockRoutes.js
import express from "express";
import TrackedStock from "../models/TrackedStock.js";
import { fetchTopGainers } from "../helpers/fetchTopGainers.js";
import Watchlist from "../models/Watchlist.js";



const router = express.Router();

// GET all tickers from all watchlists
router.get("/watchlist/tickers", async (req, res) => {
   console.log("Entering /watchlist/tickers route"); // DEBUG
  try {
    // Fetch all watchlists
    const lists = await Watchlist.find({});
    
    if (!lists) {
      return res.json({ tickers: [] });
    }

    // Flatten symbols from all watchlists
    const allTickers = lists.flatMap(list => list.symbols);

    // Remove duplicates
    const uniqueTickers = [...new Set(allTickers)];

    return res.json({ tickers: uniqueTickers });
  } catch (err) {
    console.error("Error fetching tickers:", err);
    return res.status(500).json({ error: "Failed to fetch watchlist tickers" });
  }
});


// GET top gainers
router.get("/top-gainers", async (req, res) => {
  try {
    const gainers = await fetchTopGainers();
    res.json(gainers);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch top gainers" });
  }
});

// POST new ticker
router.post("/track", async (req, res) => {
  try {
    const { symbol } = req.body;
    if (!symbol) return res.status(400).json({ error: "Symbol required" });

    const existing = await TrackedStock.findOne({ symbol: symbol.toUpperCase() });
    if (existing) return res.status(400).json({ error: "Symbol already tracked" });

    const stock = new TrackedStock({ symbol: symbol.toUpperCase() });
    await stock.save();
    res.json({ message: `${symbol.toUpperCase()} added to tracking` });
  } catch (err) {
    res.status(500).json({ error: "Failed to add ticker" });
  }
});

//============ watchlists

// Add new watchlist
router.post("/watchlist", async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) return res.status(400).json({ error: "Title required" });

    const existing = await Watchlist.findOne({ title });
    if (existing) return res.status(400).json({ error: "Watchlist already exists" });

    const list = new Watchlist({ title, symbols: [] });
    await list.save();
    res.json({ message: `Watchlist '${title}' created`, list });
  } catch (err) {
    res.status(500).json({ error: "Failed to create watchlist" });
  }
});

//Add symbol
router.post("/watchlist/:id/symbol", async (req, res) => {
  try {
    const { id } = req.params;
    const { symbol } = req.body;
    if (!symbol) return res.status(400).json({ error: "Symbol required" });

    const list = await Watchlist.findById(id);
    if (!list) return res.status(404).json({ error: "Watchlist not found" });

    if (list.symbols.includes(symbol.toUpperCase()))
      return res.status(400).json({ error: "Symbol already in list" });

    list.symbols.push(symbol.toUpperCase());
    await list.save();
    res.json({ message: `${symbol.toUpperCase()} added to '${list.title}'`, list });
  } catch (err) {
    res.status(500).json({ error: "Failed to add symbol" });
  }
});

//get all watchlists
router.get("/watchlist", async (req, res) => {
  const lists = await Watchlist.find();
  res.json(lists);
});

//get a certain watchlist
// GET /stocks/watchlist/:id
router.get("/watchlist/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const list = await Watchlist.findById(id);
    if (!list) return res.status(404).json({ error: "Watchlist not found" });
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch watchlist" });
  }
});


// DELETE /stocks/watchlist/:id
router.delete("/watchlist/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const list = await Watchlist.findByIdAndDelete(id);
    if (!list) return res.status(404).json({ error: "Watchlist not found" });

    res.json({ message: `Watchlist '${list.title}' deleted` });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete watchlist" });
  }
});


// DELETE /stocks/watchlist/:id/symbol
router.delete("/watchlist/:id/symbol", async (req, res) => {
  try {
    const { id } = req.params;
    const { symbol } = req.body; // ticker to remove
    if (!symbol) return res.status(400).json({ error: "Symbol required" });

    const list = await Watchlist.findById(id);
    if (!list) return res.status(404).json({ error: "Watchlist not found" });

    if (!list.symbols.includes(symbol.toUpperCase()))
      return res.status(400).json({ error: "Symbol not in list" });

    // Remove the symbol
    list.symbols = list.symbols.filter(s => s !== symbol.toUpperCase());
    await list.save();

    res.json({ message: `${symbol.toUpperCase()} removed from '${list.title}'`, list });
  } catch (err) {
    res.status(500).json({ error: "Failed to remove symbol" });
  }
});

//get all tickers

// GET /stocks/watchlist/tickers




export default router;
