import { Context } from "hono";
import { googleProvider } from "../../../utils/auth.providers";
import { generateState, generateCodeVerifier } from "arctic";
import { setCookie } from "hono/cookie";

export const googleAuth = async (c: Context) => {
  const state = generateState();
  const codeVerifier = generateCodeVerifier();
  const scopes = ["openid", "profile", "email"];
  const url = googleProvider.createAuthorizationURL(
    state,
    codeVerifier,
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
