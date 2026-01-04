// Logs out a user

import { Context } from "hono";
import { deleteCookie } from "hono/cookie";
import { REFRESH_TOKEN_COOKIE_NAME } from "../../../core/utils/constants";

const logout = async (c: Context) => {
  deleteCookie(c, REFRESH_TOKEN_COOKIE_NAME);
  return c.json({ message: "Logged out successfully" }, 200);
};

export default logout;
