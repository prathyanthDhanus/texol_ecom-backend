import { Router, RequestHandler } from "express";
import { ParamsDictionary, Query } from "express-serve-static-core";
import { Schema } from "joi";

export interface RouteDefinition<
  Params = ParamsDictionary,
  Body = any,
  Q = Query
> {
  method: "get" | "post" | "put" | "patch" | "delete";
  path: string;
  roles: RequestHandler;
  validator?: Schema;
  handler: RequestHandler<Params, any, Body, Q>;
}

export interface RouteDefinitionWithUploads<
  Params = ParamsDictionary,
  Body = any,
  Q = Query
> extends RouteDefinition<Params, Body, Q> {
  uploadMiddleware?: RequestHandler;
}

export const mapRoutesToRouterWithUploads = (
  router: Router,
  routes: RouteDefinitionWithUploads[],
  validateAndHandle: (schema: Schema | null, handler: any) => RequestHandler[]
): void => {
  routes.forEach(
    ({ method, path, roles, validator, handler, uploadMiddleware }) => {
      const middlewares: RequestHandler[] = [roles];

      // Add file upload middleware if specified
      if (uploadMiddleware) {
        middlewares.push(uploadMiddleware);
      }

      if (validator) {
        middlewares.push(...validateAndHandle(validator, handler));
      } else {
        middlewares.push(handler);
      }

      router[method](path, ...middlewares);
    }
  );
};
