import { RequestHandler, Request, Response, NextFunction } from "express";
import { Schema } from "joi";
import { joiValidate } from "../middleware/joiValidation";
import { tryCatch } from "../middleware/tryCatch";

// Allow Response or void for compatibility with Express
type ControllerFunction<Params = {}, Body = any, Query = any> = (
  req: Request<Params, any, Body, Query>,
  res: Response,
  next?: NextFunction
) => Promise<Response | void> | Response | void;

export function validateAndHandle<Params = {}, Body = any, Query = any>(
  schema: Schema | null,
  controller: ControllerFunction<Params, Body, Query>
): RequestHandler[] {
  const middlewares: RequestHandler[] = [];

  if (schema) {
    middlewares.push(joiValidate(schema));
  }

  const handler: RequestHandler = async (req, res, next) => {
    try {
      await controller(req as Request<Params, any, Body, Query>, res, next);
    } catch (error) {
      next(error);
    }
  };

  middlewares.push(tryCatch(handler));

  return middlewares;
}
