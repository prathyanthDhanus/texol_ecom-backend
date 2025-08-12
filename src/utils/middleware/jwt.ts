import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface DecodedToken {
  userId: string;
  email: string;
  role: string;
  [key: string]: any;
}

declare global {
  namespace Express {
    interface Request {
      user?: DecodedToken;
    }
  }
}

export const tokenVerifyUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  //  Check if authorization header exists
  if (!authHeader) {
    return res.status(401).json({ error: "Unauthorized 🚫" });
  }

  //  Extract token from header
  const tokenParts = authHeader.split(" ");
  if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
    return res.status(401).json({ error: "Invalid authorization format" });
  }

  const token = tokenParts[1];

  // Verify the token
  jwt.verify(token, process.env.USERSECRET_KEY as string, (err, decoded) => {
    if (err) {
      let errorMessage = "Invalid token ❌";
      if (err.name === "TokenExpiredError") {
        errorMessage = "Token expired ⏳";
      } else if (err.name === "JsonWebTokenError") {
        errorMessage = "Malformed token 🛑";
      }
      return res.status(403).json({ error: errorMessage });
    }

    req.user = decoded as DecodedToken;
    next();
  });
};
