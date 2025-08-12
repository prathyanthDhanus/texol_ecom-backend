import { Request, Response } from "express";
import { registerDb } from "./auth.db";

// ・・・・・・・・・・・・・・・ Register ・・・・・・・・・・・・・・・

interface RegisterRequestBody {
  username: string;
  email: string;
  password: string;
}
// 📌
export const register = async (
  req: Request<{}, {}, RegisterRequestBody>,
  res: Response
) => {
  const { username, email, password } = req.body;

  const createUser = await registerDb({ username, email, password });

  return res.status(201).json({
    status: "success",
    message: "User registered successfully",
    data: createUser,
  });
};
