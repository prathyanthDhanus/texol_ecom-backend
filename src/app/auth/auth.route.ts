import express from "express";
import { RequestHandler } from "express";

import { validateAndHandle } from "../../utils/helper/ValidateAndHandle";
import { registerSchema } from "./auth.validator";
import { register } from "./service/auth.controller";

const router = express.Router();

router.post(
  "/register",
  validateAndHandle(registerSchema, register) as RequestHandler[]
);

export const Auth_Router = router;
export default Auth_Router;
