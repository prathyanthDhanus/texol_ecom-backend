import express, { Application, Request, Response } from "express";
import cors from "cors";

const app: Application = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.get("/", (req: Request, res: Response) => {
  res.send("Hello from Express + TypeScript!");
});

export default app;
