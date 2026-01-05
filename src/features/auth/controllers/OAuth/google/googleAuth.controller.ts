import { Context } from "hono";
import { setCookie } from "hono/cookie";
import {
  generateState,
  generateCodeVerifier,
  generateCodeChallenge,
  createGoogleAuthorizationURL,
} from "../../../../../core/utils/oauth";

export const googleAuth = async (c: Context) => {
  const state = generateState();
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = generateCodeChallenge(codeVerifier);
  const scopes = ["openid", "profile", "email"];

  const url = createGoogleAuthorizationURL(
    process.env.GOOGLE_CLIENT_ID!,
    process.env.GOOGLE_REDIRECT_URI!,
    state,
    codeChallenge,
    scopes
  );

  // Store state cookie
  setCookie(c, "google_oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 600,
    sameSite: "Lax",
  });

  // Store code verifier cookie
  setCookie(c, "google_oauth_code_verifier", codeVerifier, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 600,
    sameSite: "Lax",
  });

  return c.redirect(url.toString());
};
