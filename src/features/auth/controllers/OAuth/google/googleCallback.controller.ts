import { Context } from "hono";
import { getGoogleProvider } from "../../../utils/auth.providers";
import { deleteCookie, getCookie } from "hono/cookie";
import {
  BadRequestError,
  UnauthorizedError,
} from "../../../../../core/utils/errors";
import User from "../../../../users/model/user.model";
import { generateRefreshToken } from "../../../../../core/utils/jwt";
import { setCookie } from "hono/cookie";
import {
  REFRESH_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_OPTIONS,
} from "../../../../../core/utils/constants";

export const googleCallback = async (c: Context) => {
  const code = c.req.query("code");
  const state = c.req.query("state");
  const storedState = getCookie(c, "google_oauth_state");
  const codeVerifier = getCookie(c, "google_oauth_code_verifier");

  // Validate the OAuth state to protect against CSRF
  if (
    !code ||
    !state ||
    !codeVerifier ||
    !storedState ||
    state !== storedState
  ) {
    throw new BadRequestError("Invalid OAuth state");
  }

  deleteCookie(c, "google_oauth_state");
  deleteCookie(c, "google_oauth_code_verifier");

  // Exchange code for tokens using Arctic
  const googleProvider = await getGoogleProvider();
  const tokens = await googleProvider.validateAuthorizationCode(
    code,
    codeVerifier
  );

  // Get user info from Google
  const response = await fetch(
    "https://www.googleapis.com/oauth2/v2/userinfo",
    {
      headers: {
        Authorization: `Bearer ${tokens.accessToken()}`,
      },
    }
  );

  if (!response.ok) {
    throw new UnauthorizedError("Failed to fetch user info from Google");
  }

  const googleUser = await response.json();

  let user = await User.findOne({ googleId: googleUser.id });

  if (!user) {
    user = await User.findOne({ email: googleUser.email });

    if (user && user.provider === "local") {
      throw new BadRequestError(
        "An account with this email already exists. Please login with your password."
      );
    }

    if (!user) {
      user = await User.create({
        email: googleUser.email,
        googleId: googleUser.id,
        name: {
          firstName: googleUser.given_name,
          lastName: googleUser.family_name || "",
        },
        provider: "google",
        role: "user",
      });
    }
  }

  const refreshToken = await generateRefreshToken(user);

  setCookie(
    c,
    REFRESH_TOKEN_COOKIE_NAME,
    refreshToken,
    REFRESH_TOKEN_COOKIE_OPTIONS
  );

  return c.redirect(`${process.env.CORS_ORIGIN}`);
};
