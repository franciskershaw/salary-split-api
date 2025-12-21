import { MiddlewareHandler } from "hono";
import { auth } from "../config/auth";
import { UnauthorizedError } from "../utils/errors";

export const authenticate: MiddlewareHandler = async (c, next) => {
  const session = await auth.api.getSession({
    headers: c.req.raw.headers,
  });

  if (!session) {
    throw new UnauthorizedError("Invalid or expired access token");
  }

  c.set("user", session.user);
  await next();
};
