import { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Simple test response
    res.status(200).json({ 
      message: "Backend is working!",
      timestamp: new Date().toISOString(),
      url: req.url,
      method: req.method
    });
  } catch (error) {
    console.error('Error in handler:', error);
    res.status(500).json({ 
      error: "Internal server error",
      message: error instanceof Error ? error.message : "Unknown error"
    });
  }
}
