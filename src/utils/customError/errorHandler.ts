import { Request, Response, NextFunction } from "express";
import AppError from "./AppError";

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.StatusCode || 500;

  res.status(statusCode).json({
    status: err.status || "error",
    message: err.message || "Internal Server Error",
    error: err.ErrorMessage || null,
  });
};
