import { Document, Types } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import Auth from "../model/auth.model";
import AppError from "../../../utils/customError/AppError";
import { tokenService } from "./auth.common";

export interface IUserDoc extends Document<Types.ObjectId> {
  username: string;
  email: string;
  password: string;
  role: string;
}

export type IUserSafe = {
  _id: Types.ObjectId;
  username: string;
  email: string;
  role: string;
};

// ・・・・・・・・・・・・・・・ Register ・・・・・・・・・・・・・・・

interface RegisterDbParams {
  username: string;
  email: string;
  password: string;
  role: string;
}
//📌
export const registerDb = async ({
  username,
  email,
  password,
  role,
}: RegisterDbParams): Promise<IUserSafe> => {
  const findUser = await Auth.findOne({ email });
  if (findUser) {
    throw new AppError(
      "User already exists",
      "Field validation error: User already exists",
      409
    );
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const assignedRole = role === "admin" ? "admin" : "user";

  const saveUser = new Auth({
    username,
    email,
    password: passwordHash,
    role: assignedRole,
  }) as IUserDoc;

  await saveUser.save();

  const { password: _pw, ...safeUser } = saveUser.toObject();
  return safeUser as IUserSafe;
};

// ・・・・・・・・・・・・・・・ Login ・・・・・・・・・・・・・・・
interface LoginDbParams {
  email: string;
  password: string;
}

interface LoginResult {
  user: IUserSafe;
  accessToken: string;
  refreshToken: string;
}
//📌
export const loginDb = async ({
  email,
  password,
}: LoginDbParams): Promise<LoginResult> => {
  
  const user = (await Auth.findOne({ email })) as IUserDoc | null;
  if (!user) {
    throw new AppError(
      "Invalid email",
      "Field validation error: Email mismatch",
      401
    );
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new AppError(
      "Invalid password",
      "Field validation error: Password mismatch",
      401
    );
  }

  const { accessToken, refreshToken } = await tokenService(
    user._id.toString(),
    user.role
  );

  const { password: _pw, ...safeUser } = user.toObject();
  return {
    user: safeUser as IUserSafe,
    accessToken,
    refreshToken,
  };
};
