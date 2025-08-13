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

// import { Request, Response, NextFunction } from "express";
// import jwt from "jsonwebtoken";

// interface DecodedToken {
//   userId: string;
//   email: string;
//   role: "user" | "admin";
//   [key: string]: any;
// }

// declare global {
//   namespace Express {
//     interface Request {
//       user?: DecodedToken;
//     }
//   }
// }

// // Map roles to their corresponding secret keys
// const roleSecrets: Record<string, string> = {
//   user: process.env.USERSECRET_KEY as string,
//   admin: process.env.ADMINSECRET_KEY as string,
// };

// export function tokenVerify(allowedRoles: string[]) {
//   return (req: Request, res: Response, next: NextFunction) => {
//     const authHeader = req.headers.authorization;

//     if (!authHeader) {
//       return res.status(401).json({ error: "Unauthorized 🚫" });
//     }

//     const tokenParts = authHeader.split(" ");
//     if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
//       return res.status(401).json({ error: "Invalid authorization format" });
//     }

//     const token = tokenParts[1];

//     try {
//       const decodedUnverified = jwt.decode(token) as DecodedToken | null;
//       if (!decodedUnverified || !decodedUnverified.role) {
//         return res.status(401).json({ error: "Invalid token payload" });
//       }

//       if (!allowedRoles.includes(decodedUnverified.role)) {
//         return res.status(403).json({ error: "Forbidden ❌" });
//       }

//       const secretKey = roleSecrets[decodedUnverified.role];
//       if (!secretKey) {
//         return res.status(403).json({ error: "Unknown role" });
//       }
//       const verified = jwt.verify(token, secretKey) as DecodedToken;
//       req.user = verified;
//       next();
//     } catch (err: any) {
//       let errorMessage = "Invalid token ❌";
//       if (err.name === "TokenExpiredError") {
//         errorMessage = "Token expired ⏳";
//       } else if (err.name === "JsonWebTokenError") {
//         errorMessage = "Malformed token 🛑";
//       }
//       return res.status(403).json({ error: errorMessage });
//     }
//   };
// }
