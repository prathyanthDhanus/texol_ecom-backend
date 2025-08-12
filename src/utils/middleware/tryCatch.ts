import { Request, Response, NextFunction, RequestHandler } from "express";
import AppError from "../customError/AppError";

type ControllerFunction = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;

export const tryCatch = (controller: ControllerFunction): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await controller(req, res, next);
    } catch (error: unknown) {
      if (error instanceof AppError) {
        res.status(error.StatusCode).json({
          status: "failure",
          message: error.ErrorMessage,
          ...(process.env.NODE_ENV === "development" && {
            stack: error.stack,
          }),
        });
      } else {
        const err =
          error instanceof Error ? error : new Error("Unknown error occurred");

        res.status(500).json({
          status: "error",
          message: "Something went wrong",
          error_message: err.message,
          ...(process.env.NODE_ENV === "development" && {
            stack: err.stack,
          }),
        });
      }
    }
  };
};
