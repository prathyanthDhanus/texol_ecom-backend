import { Request, Response, NextFunction, RequestHandler } from 'express';
import { Schema } from 'joi';

export const joiValidate = (schema: Schema): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const errorDetails = error.details.map((detail) => detail.message);
      return res.status(400).json({
        message: "Validation failed",
        errors: errorDetails,
      });
    }

    next();
  };
};