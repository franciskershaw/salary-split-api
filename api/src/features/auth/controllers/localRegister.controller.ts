// Registers a new user using email and password

import { Context } from "hono";
import { ConflictError } from "../../../core/utils/errors";
import User from "../../users/model/user.model";
import bcrypt from "bcryptjs";
import { sendTokensAndUser } from "../utils/auth.helper";
import { LocalRegisterInput } from "../validation/localRegister.auth.validation";

const localRegister = async (c: Context) => {
  const { email, password, name } = await c.req.json<LocalRegisterInput>();

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ConflictError("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    email,
    name,
    password: hashedPassword,
    provider: "local",
  });

  return sendTokensAndUser(c, user.toObject(), 201);
};

export default localRegister;
