import { randomBytes, createHash } from "crypto";

/**
 * Base64URL encoding (no padding, URL-safe)
 * Converts buffer to base64 and replaces + with -, / with _, and removes = padding
 */
function base64URLEncode(buffer: Buffer): string {
  return buffer
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

/**
 * Generate cryptographically secure random state parameter for CSRF protection
 * Uses 32 bytes (256 bits) of random data, encoded as Base64URL
 * @returns A secure random state string (43 characters)
 */
export function generateState(): string {
  return base64URLEncode(randomBytes(32));
}

/**
 * Generate PKCE code verifier (43-128 chars, URL-safe)
 * Uses 32 bytes (256 bits) of random data, encoded as Base64URL
 * This is stored in an httpOnly cookie and used later to verify the code challenge
 * @returns A secure random code verifier string (43 characters)
 */
export function generateCodeVerifier(): string {
  return base64URLEncode(randomBytes(32));
}

/**
 * Generate PKCE code challenge from verifier using SHA256
 * This is sent to the authorization server and must match the verifier on token exchange
 * @param verifier - The code verifier string
 * @returns The SHA256 hash of the verifier, Base64URL encoded (43 characters)
 */
export function generateCodeChallenge(verifier: string): string {
  return base64URLEncode(
    createHash("sha256").update(verifier).digest()
  );
}

/**
 * Create Google OAuth 2.0 authorization URL with PKCE
 * @param clientId - Google OAuth client ID
 * @param redirectUri - The redirect URI registered with Google
 * @param state - CSRF protection state parameter
 * @param codeChallenge - PKCE code challenge (SHA256 hash of code verifier)
 * @param scopes - Array of OAuth scopes to request
 * @returns A URL object pointing to Google's authorization endpoint
 */
export function createGoogleAuthorizationURL(
  clientId: string,
  redirectUri: string,
  state: string,
  codeChallenge: string,
  scopes: string[]
): URL {
  const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", scopes.join(" "));
  url.searchParams.set("state", state);
  url.searchParams.set("code_challenge", codeChallenge);
  url.searchParams.set("code_challenge_method", "S256");
  url.searchParams.set("access_type", "offline"); // Request refresh token
  url.searchParams.set("prompt", "consent"); // Force consent screen to ensure refresh token
  return url;
}

/**
 * Exchange authorization code for access token using PKCE
 * Validates the code verifier against the code challenge sent during authorization
 * @param code - Authorization code from Google callback
 * @param codeVerifier - The original code verifier (must match the challenge)
 * @param clientId - Google OAuth client ID
 * @param clientSecret - Google OAuth client secret
 * @param redirectUri - The redirect URI (must match the one used in authorization)
 * @returns Token response with access token, refresh token, expiry, and type
 * @throws Error if token exchange fails or response is invalid
 */
export async function exchangeGoogleCodeForTokens(
  code: string,
  codeVerifier: string,
  clientId: string,
  clientSecret: string,
  redirectUri: string
): Promise<{
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
  tokenType: string;
}> {
  const tokenUrl = "https://oauth2.googleapis.com/token";

  const response = await fetch(tokenUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
      code_verifier: codeVerifier,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      error: "Unknown error",
      error_description: `HTTP ${response.status}`,
    }));
    throw new Error(
      `Token exchange failed: ${error.error || "unknown_error"} - ${
        error.error_description || "No description available"
      }`
    );
  }

  const tokens = await response.json();

  // Validate response structure
  if (!tokens.access_token) {
    throw new Error("Invalid token response: missing access_token");
  }

  return {
    accessToken: tokens.access_token,
    refreshToken: tokens.refresh_token,
    expiresIn: tokens.expires_in || 3600,
    tokenType: tokens.token_type || "Bearer",
  };
}

