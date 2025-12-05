import mongoose from "mongoose";

const WatchlistSchema = new mongoose.Schema({
  title: { type: String, required: true }, // name of the watchlist
  symbols: [{ type: String }],            // array of stock tickers
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Watchlist", WatchlistSchema);
