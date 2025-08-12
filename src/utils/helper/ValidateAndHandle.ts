import { RequestHandler } from "express";
import { Schema } from "joi";
import { joiValidate } from "../middleware/joiValidation";
import { tryCatch } from "../middleware/tryCatch";

type ControllerFunction = (
  req: Parameters<RequestHandler>[0],
  res: Parameters<RequestHandler>[1],
  next: Parameters<RequestHandler>[2]
) => Promise<any>;

export function validateAndHandle(
  schema: Schema | null,
  controller: ControllerFunction
): RequestHandler[] {
  const middlewares: RequestHandler[] = [];

  if (schema) {
    middlewares.push(joiValidate(schema));
  }

  middlewares.push(tryCatch(controller));
  return middlewares;
}