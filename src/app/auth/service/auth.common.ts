import jwt from "jsonwebtoken";
import RefreshToken from "../model/auth.refreshtoken";
import { Request, Response } from "express";

interface TokenPayload {
  userId: string;
  role: string;
  iat?: number;
  exp?: number;
}

interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}

interface RefreshTokenRequest extends Request {
  body: {
    refreshToken?: string;
  };
}

const secretKey = process.env.USERSECRET_KEY;
if (!secretKey) {
  throw new Error("USERSECRET_KEY is not configured in environment variables");
}

// ・・・・・・・・・・・・・・・ Generate token ・・・・・・・・・・・・・・・
export const tokenService = async (
  userId: string,
  role: string
): Promise<TokenResponse> => {
  // Generate Access Token
  const accessToken = jwt.sign(
    { userId, role },
    secretKey,
    { expiresIn: "1h" }
  );

  // Generate Refresh Token
  const refreshToken = jwt.sign(
    { userId, role },
    secretKey,
    { expiresIn: "7d" }
  );

  // Upsert refresh token
  await RefreshToken.findOneAndUpdate(
    { userId },
    { token: refreshToken },
    { upsert: true, new: true }
  );

  return { accessToken, refreshToken };
};


// ・・・・・・・・・・・・・・・ Refresh token ・・・・・・・・・・・・・・・

export const refreshTokenService = async (req: RefreshTokenRequest, res: Response) => {
  const refreshToken = req.body.refreshToken;
  
  if (!refreshToken) {
    return res.status(401).json({ 
      status: "error",
      message: "Refresh token is required" 
    });
  }

  try {
    const decoded = jwt.verify(refreshToken, secretKey) as TokenPayload;
    
    const existingToken = await RefreshToken.findOne({
      userId: decoded.userId,
      token: refreshToken,
    });

    if (!existingToken) {
      return res.status(403).json({ 
        status: "error",
        message: "Invalid refresh token" 
      });
    }

    const { accessToken, refreshToken: newRefreshToken } = await tokenService(
      decoded.userId,
      decoded.role
    );

    return res.status(200).json({
      status: "success",
      message: "Tokens refreshed successfully",
      data: {
        accessToken,
        refreshToken: newRefreshToken,
      },
    });
  } catch (error) {
    console.error("Refresh token error:", error);
    
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(403).json({
        status: "error",
        message: "Refresh token expired",
      });
    }
    
    return res.status(403).json({
      status: "error",
      message: "Invalid refresh token",
    });
  }
};