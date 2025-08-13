import { Socket } from "socket.io";
import { Request } from "express";

export interface AuthenticatedSocket extends Socket {
  data: {
    userId?: string;
    isAdmin?: boolean;
  };
}

export interface SocketRequest extends Request {
  io?: any;
}