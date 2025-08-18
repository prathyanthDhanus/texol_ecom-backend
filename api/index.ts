import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Main_Router from '../src/routes';
import { errorHandler } from '../src/utils/customError/errorHandler';

// Load environment variables
dotenv.config();

const app = express();

// MongoDB connection
const connectDB = async () => {
  try {
    const url = process.env.MONGODB_URL;
    if (!url) {
      throw new Error('MONGODB_URL is not defined');
    }
    await mongoose.connect(url);
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    throw error;
  }
};

// Connect to database
connectDB();

// Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true
}));

// Health check endpoint
app.get('/api/v1/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Backend is running!',
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Main routes
app.use("/api/v1", Main_Router);

// Error handler
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: "Not found",
    message: `Route ${req.originalUrl} not found`
  });
});

export default app;
