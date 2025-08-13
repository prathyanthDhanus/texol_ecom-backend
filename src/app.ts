import express, { Application } from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import Main_Router from "./routes";
import { initializeSocket } from "./utils/soket";
import { errorHandler } from "./utils/customError/errorHandler";

const app: Application = express();
const httpServer = createServer(app);

// Enhanced Socket.IO setup
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
  pingTimeout: 60000,
});

// Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);

app.use("/api/v1", Main_Router);

// Initialize Socket.IO with custom event handlers
initializeSocket(io); 

// Make io accessible in routes
app.set("io", io);
app.use(errorHandler);

export { app, httpServer };
