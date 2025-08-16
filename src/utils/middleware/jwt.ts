import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

interface DecodedToken extends JwtPayload {
  userId: string;
  email: string;
  role: "user" | "admin";
}

declare global {
  namespace Express {
    interface Request {
      user?: DecodedToken;
    }
  }
}

const ROLE_SECRETS = Object.freeze({
  user: process.env.USER_SECRET_KEY as string,
  admin: process.env.ADMIN_SECRET_KEY as string,
});

if (!ROLE_SECRETS.user || !ROLE_SECRETS.admin) {
  throw new Error("❌ Missing required secret keys in environment variables");
}

export function authorize(allowedRoles: ("user" | "admin")[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      res.status(401).json({
        error: "🔐 Unauthorized - Missing or invalid authorization header",
      });
      return;
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      res.status(401).json({ error: "🛑 Missing token" });
      return;
    }

    try {
      const decoded = jwt.decode(token) as DecodedToken | null;

      if (!decoded?.role || !decoded.userId) {
        res.status(401).json({ error: "🛑 Invalid token payload" });
        return;
      }

      if (!allowedRoles.includes(decoded.role)) {
        res
          .status(403)
          .json({ error: "⛔ Forbidden - Insufficient privileges" });
        return;
      }

      const secret = ROLE_SECRETS[decoded.role];

      const verified = jwt.verify(token, secret) as DecodedToken;

      req.user = verified;

      next();
    } catch (err) {
      if (err instanceof jwt.TokenExpiredError) {
        res.status(401).json({ error: "⏳ Token expired" });
        return;
      }
      if (err instanceof jwt.JsonWebTokenError) {
        res.status(401).json({ error: "❌ Invalid token" });
        return;
      }

      console.error("🔴 JWT verification error:", err);
      res.status(500).json({ error: "⚡ Internal server error" });
      return;
    }
  };
}
