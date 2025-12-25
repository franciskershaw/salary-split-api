// Logs in a user using email and password

import { Context } from "hono";
import { LocalLoginInput } from "../../validation/localLogin.auth.validation";
import User from "../../../users/model/user.model";
import { UnauthorizedError } from "../../../../core/utils/errors";
import bcrypt from "bcryptjs";
import { sendTokensAndUser } from "../../utils/auth.helper";

const localLogin = async (c: Context) => {
  const { email, password } = await c.req.json<LocalLoginInput>();

  const user = await User.findOne({ email }).select("+password");
  if (!user || !user.password) {
    throw new UnauthorizedError("Invalid email or password");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new UnauthorizedError("Invalid email or password");
  }

  return sendTokensAndUser(c, user.toObject());
};

export default localLogin;
