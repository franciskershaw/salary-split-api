import { Response } from "express";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../../core/utils/jwt";
import { IUser } from "../../users/model/user.model";
import {
  REFRESH_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_OPTIONS,
} from "../../../core/utils/constants";

const sendTokensAndUser = async (
  res: Response,
  user: IUser,
  status: number = 200
) => {
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  res.cookie(
    REFRESH_TOKEN_COOKIE_NAME,
    refreshToken,
    REFRESH_TOKEN_COOKIE_OPTIONS
  );

  res.status(status).json({ ...user, accessToken });
};

export { sendTokensAndUser };
