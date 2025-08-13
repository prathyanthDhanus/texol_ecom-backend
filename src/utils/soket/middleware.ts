import { AuthenticatedSocket } from "./types";
import jwt from "jsonwebtoken";
import config from "../../app/config";

export const SocketMiddleware = (socket: AuthenticatedSocket, next: any) => {
  try {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error("Authentication error"));

    const decoded = jwt.verify(token, config.jwt.secret) as any;
    socket.data = {
      userId: decoded.userId,
      isAdmin: decoded.role === "admin"
    };
    next();
  } catch (err) {
    next(new Error("Authentication error"));
  }
};