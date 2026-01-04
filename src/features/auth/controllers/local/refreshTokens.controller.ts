import { Context } from "hono";
import { getCookie, setCookie, deleteCookie } from "hono/cookie";
import { verifyRefreshToken } from "../../../../core/utils/jwt";
import {
  UnauthorizedError,
  ForbiddenError,
} from "../../../../core/utils/errors";
import {
  REFRESH_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_OPTIONS,
} from "../../../../core/utils/constants";
import User from "../../../users/model/user.model";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../../../core/utils/jwt";

const refreshTokens = async (c: Context) => {
  const refreshToken = getCookie(c, REFRESH_TOKEN_COOKIE_NAME);

  if (!refreshToken) {
    throw new UnauthorizedError(
      "No refresh token provided",
      "REFRESH_TOKEN_MISSING"
    );
  }

  const decoded = await verifyRefreshToken(refreshToken);

  if (!decoded) {
    deleteCookie(c, REFRESH_TOKEN_COOKIE_NAME);
    throw new ForbiddenError("Invalid or expired refresh token");
  }

  // Fetch user from database to get full user object
  // (decoded only has _id and email from JWT payload)
  const user = await User.findById(decoded._id);

  if (!user) {
    deleteCookie(c, REFRESH_TOKEN_COOKIE_NAME);
    throw new UnauthorizedError("User not found");
  }

  // Generate new tokens
  const newAccessToken = await generateAccessToken(user);
  const newRefreshToken = await generateRefreshToken(user);

  // Set new refresh token cookie
  setCookie(
    c,
    REFRESH_TOKEN_COOKIE_NAME,
    newRefreshToken,
    REFRESH_TOKEN_COOKIE_OPTIONS
  );

  // Return new access token
  return c.json({ accessToken: newAccessToken }, 200);
};

export default refreshTokens;
