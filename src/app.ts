import express, { Application, Request, Response } from "express";
import cors from "cors";

import Main_Router from "./routes";
const app: Application = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use("/api/v1", Main_Router);

// Routes
app.get("/", (req: Request, res: Response) => {
  res.send("Hello from Express + TypeScript!");
});

export default app;
