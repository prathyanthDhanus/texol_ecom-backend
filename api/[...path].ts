import { VercelRequest, VercelResponse } from '@vercel/node';
import express from 'express';
import cors from 'cors';
import Main_Router from '../src/routes';
import { errorHandler } from '../src/utils/customError/errorHandler';

// Create Express app for Vercel
const app = express();

// Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Routes
app.use("/api/v1", Main_Router);

// Error handler
app.use(errorHandler);

export default function handler(req: VercelRequest, res: VercelResponse) {
  return new Promise((resolve, reject) => {
    // Convert Vercel request/response to Express format
    const expressReq = req as any;
    const expressRes = res as any;
    
    // Add missing properties that Express expects
    expressReq.url = req.url;
    expressReq.method = req.method;
    expressReq.headers = req.headers;
    expressReq.body = req.body;
    
    // Handle the request through Express app
    app(expressReq, expressRes, (err: any) => {
      if (err) {
        reject(err);
      } else {
        resolve(expressRes);
      }
    });
  });
}
