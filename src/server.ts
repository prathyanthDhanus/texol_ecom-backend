import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import { httpServer } from "./app";

const url = process.env.MONGODB_URL as string;
const PORT = process.env.PORT || 3000;

// Enhanced environment validation
const requiredEnvVars = [
  "USERSECRET_KEY", 
  "ADMINSECRET_KEY",
  "MONGODB_URL",
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET"
];

requiredEnvVars.forEach((env) => {
  if (!process.env[env]) {
    throw new Error(`Missing required environment variable: ${env}`);
  }
});

// MongoDB connection with better error handling
mongoose.connect(url)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((error) => {
    console.error("MongoDB connection error:", error);
    process.exit(1);
});

// Server error handling
httpServer.on("error", (error) => {
  console.error("Server error:", error);
});

httpServer.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});