import jwt from "jsonwebtoken";

const generateAccessToken = (id: string) => {
  const secret = process.env.ACCESS_TOKEN_SECRET;
  if (!secret) {
    throw new Error("ACCESS_TOKEN_SECRET is not set");
  }
  return jwt.sign({ _id: id }, secret, {
    expiresIn: "15m",
  });
};

const generateRefreshToken = (id: string) => {
  const secret = process.env.REFRESH_TOKEN_SECRET;
  if (!secret) {
    throw new Error("REFRESH_TOKEN_SECRET is not set");
  }
  return jwt.sign({ _id: id }, secret, {
    expiresIn: "30d",
  });
};

const verifyToken = (token: string, secret: string) => {
  return jwt.verify(token, secret);
};

export { generateAccessToken, generateRefreshToken, verifyToken };
