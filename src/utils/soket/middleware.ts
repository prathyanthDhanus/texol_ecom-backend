import { AuthenticatedSocket } from "./types";
import jwt from "jsonwebtoken";

const ROLE_SECRETS = Object.freeze({
  user: process.env.USER_SECRET_KEY as string,
  admin: process.env.ADMIN_SECRET_KEY as string,
});

if (!ROLE_SECRETS.user || !ROLE_SECRETS.admin) {
  throw new Error("Missing required secret keys in environment variables");
}

export const SocketMiddleware = (socket: AuthenticatedSocket, next: any) => {
  try {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error("Authentication error"));

    const decoded = jwt.decode(token) as any;
    if (!decoded?.role || !decoded.userId) {
      return next(new Error("Invalid token payload"));
    }

    const secret = ROLE_SECRETS[decoded.role as keyof typeof ROLE_SECRETS];
    const verified = jwt.verify(token, secret) as any;
    
    socket.data = {
      userId: verified.userId,
      isAdmin: verified.role === "admin"
    };
    next();
  } catch (err) {
    next(new Error("Authentication error"));
  }
};