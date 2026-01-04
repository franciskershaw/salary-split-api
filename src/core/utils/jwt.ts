import { sign, verify } from "hono/jwt";
import { JWTPayload } from "hono/utils/jwt/types";
import { IUser } from "../../features/users/model/user.model";

// Types for token payload
interface TokenPayload extends JWTPayload {
  _id: string;
  email: string;
  exp: number;
}

const createPayload = (
  user: IUser,
  expiresInMinutes: number
): TokenPayload => ({
  _id: user._id.toString(),
  email: user.email,
  exp: Math.floor(Date.now() / 1000) + expiresInMinutes * 60,
});

// Generate access token (30 minutes)
export const generateAccessToken = async (user: IUser): Promise<string> => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not defined");
  }

  const payload = createPayload(user, 30);
  return await sign(payload, secret);
};

// Generate refresh token (7 days)
export const generateRefreshToken = async (user: IUser): Promise<string> => {
  const secret = process.env.JWT_REFRESH_SECRET;
  if (!secret) {
    throw new Error("JWT_REFRESH_SECRET is not defined");
  }

  const payload = createPayload(user, 7 * 24 * 60); // 7 days in minutes
  return await sign(payload, secret);
};

// Verify access token
export const verifyAccessToken = async (
  token: string
): Promise<TokenPayload | null> => {
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET is not defined");
    }

    const payload = await verify(token, secret);
    return payload as TokenPayload;
  } catch {
    return null;
  }
};

// Verify refresh token
export const verifyRefreshToken = async (
  token: string
): Promise<TokenPayload | null> => {
  try {
    const secret = process.env.JWT_REFRESH_SECRET;
    if (!secret) {
      throw new Error("JWT_REFRESH_SECRET is not defined");
    }

    const payload = await verify(token, secret);
    return payload as TokenPayload;
  } catch {
    return null;
  }
};
