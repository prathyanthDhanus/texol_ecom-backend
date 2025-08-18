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

const USER_SECRET_KEY = process.env.USER_SECRET_KEY;
const ADMIN_SECRET_KEY = process.env.ADMIN_SECRET_KEY;

// Function to check if secrets are configured
const checkSecrets = () => {
  if (!USER_SECRET_KEY || !ADMIN_SECRET_KEY) {
    throw new Error("USER_SECRET_KEY and ADMIN_SECRET_KEY must be configured in environment variables");
  }
};

// ・・・・・・・・・・・・・・・ Generate token ・・・・・・・・・・・・・・・

export const tokenService = async (
  userId: string,
  role: string
): Promise<TokenResponse> => {
  // Check if secrets are configured
  checkSecrets();
  
  // Select the appropriate secret key based on role
  const secretKey = role === 'admin' ? ADMIN_SECRET_KEY : USER_SECRET_KEY;
  
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
    // Check if secrets are configured
    checkSecrets();
    
    // First, decode the token to get the role without verification
    const decodedWithoutVerification = jwt.decode(refreshToken) as TokenPayload;
    
    if (!decodedWithoutVerification?.role) {
      return res.status(403).json({ 
        status: "error",
        message: "Invalid refresh token - missing role" 
      });
    }
    
    // Select the appropriate secret key based on role
    const secretKey = decodedWithoutVerification.role === 'admin' ? ADMIN_SECRET_KEY : USER_SECRET_KEY;
    
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
    // Refresh token error
    
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