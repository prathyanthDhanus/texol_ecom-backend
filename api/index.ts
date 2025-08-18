import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();

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
    env: process.env.NODE_ENV || 'development'
  });
});

// Test endpoint
app.get('/api/v1/test', (req, res) => {
  res.json({ 
    message: "API is working!",
    env: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: "Internal server error",
    message: err.message || "Something went wrong"
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: "Not found",
    message: `Route ${req.originalUrl} not found`
  });
});

export default app;
