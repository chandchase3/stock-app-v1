import dotenv from "dotenv";
import path from "path";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";

mongoose.set('strictQuery', true); // optional, suppress deprecation warning

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

const startServer = async () => {
  try {
    await mongoose.connect(mongoUri);
    console.log("MongoDB connected");

    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
};

startServer();


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
