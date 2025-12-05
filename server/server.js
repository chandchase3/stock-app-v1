import dotenv from "dotenv";
import path from "path";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";

// Routes
import stockRoutes from "./routes/stockRoutes.js";

// Load environment variables from .env
dotenv.config({ path: path.resolve('./server/.env') });

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());


// After middleware
app.use("/stocks", stockRoutes);

// Connect to MongoDB
const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  console.error("Error: MONGO_URI is not defined in .env");
  process.exit(1);
}

mongoose.connect(mongoUri)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Test route
app.get('/', (req, res) => {
  res.send('Stock Scanner API is running...');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
