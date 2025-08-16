import express, { RequestHandler } from "express";
import { validateAndHandle } from "../../utils/helper/ValidateAndHandle";
import {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
} from "./auth.validator";
import { register, login } from "./service/auth.controller";
import { refreshTokenService } from "./service/auth.common";
import {
  mapRoutesToRouterWithUploads,
  RouteDefinitionWithUploads,
} from "../../utils/helper/mapRoutesToRouter";

const router = express.Router();

// Route definitions
const routes: RouteDefinitionWithUploads[] = [
  {
    method: "post",
    path: "/register",
    roles: [] as any, // No auth required for registration
    validator: registerSchema,
    handler: register as unknown as RequestHandler,
  },
  {
    method: "post",
    path: "/login",
    roles: [] as any, // No auth required for login
    validator: loginSchema,
    handler: login as unknown as RequestHandler,
  },
  {
    method: "post",
    path: "/refresh-token",
    roles: [] as any, // No auth required for token refresh
    validator: refreshTokenSchema,
    handler: refreshTokenService as unknown as RequestHandler,
  },
];

//🎯
mapRoutesToRouterWithUploads(router, routes, validateAndHandle);

export const Auth_Router = router;
export default Auth_Router;
