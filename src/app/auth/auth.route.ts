import express from "express";
import { RequestHandler } from "express";

import { validateAndHandle } from "../../utils/helper/ValidateAndHandle";
import { registerSchema, loginSchema } from "./auth.validator";
import { register, login } from "./service/auth.controller";
import { refreshTokenService } from "./service/auth.common";

const router = express.Router();

router.post(
  "/register",
  validateAndHandle(registerSchema, register) as RequestHandler[]
);
router.post(
  "/login",
  validateAndHandle(loginSchema, login) as RequestHandler[]
);

export const Auth_Router = router;
export default Auth_Router;
