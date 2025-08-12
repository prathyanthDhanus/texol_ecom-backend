import { Request, Response } from "express";
import { registerDb, loginDb } from "./auth.db";

// ・・・・・・・・・・・・・・・ Register ・・・・・・・・・・・・・・・

interface RegisterRequestBody {
  username: string;
  email: string;
  password: string;
  role: string;
}
// 📌
export const register = async (
  req: Request<{}, {}, RegisterRequestBody>,
  res: Response
) => {
  const { username, email, password, role } = req.body;

  const createUser = await registerDb({ username, email, password, role });

  return res.status(201).json({
    status: "success",
    message: "User registered successfully",
    data: createUser,
  });
};

// ・・・・・・・・・・・・・・・ Login ・・・・・・・・・・・・・・・
interface LoginRequestBody {
  email: string;
  password: string;
}
// 📌
export const login = async (
  req: Request<{}, {}, LoginRequestBody>,
  res: Response
) => {
  const { email, password } = req.body;

  const authUser = await loginDb({ email, password });

  return res.status(200).json({
    status: "success",
    message: "User logged in successfully",
    data: authUser,
  });
};
