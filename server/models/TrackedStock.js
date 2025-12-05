import mongoose from "mongoose";

const TrackedStockSchema = new mongoose.Schema({
  symbol: { type: String, required: true, unique: true },
});

export default mongoose.model("TrackedStock", TrackedStockSchema);
