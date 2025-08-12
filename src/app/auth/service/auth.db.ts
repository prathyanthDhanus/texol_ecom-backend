import { Document } from "mongoose";
import bcrypt from "bcrypt";

import Auth from "../auth.model";
import AppError from "../../../utils/customError/AppError";

// ・・・・・・・・・・・・・・・ Register ・・・・・・・・・・・・・・・
export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
}

interface RegisterDbParams {
  username: string;
  email: string;
  password: string;
}
// 📌
export const registerDb = async ({
  username,
  email,
  password,
}: RegisterDbParams): Promise<IUser> => {
  const findUser = await Auth.findOne({ email });
  if (findUser) {
    throw new AppError(
      "User already exists",
      "Field validation error: User already exists",
      409
    );
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const saveUser = new Auth({
    username,
    email,
    password: passwordHash,
  });

  await saveUser.save();
  return saveUser;
};
