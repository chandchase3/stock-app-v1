import mongoose from "mongoose";

const stockSchema = new mongoose.Schema({
  symbol: {
    type: String,
    required: true,
    uppercase: true,
    trim: true
  },
  price: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const Stock = mongoose.model("Stock", stockSchema);

export default Stock;
