import { Request, Response } from "express";
import { IUser } from "../../users/model/user.model";
import { generateRefreshToken } from "../../../core/utils/jwt";
import {
  REFRESH_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_OPTIONS,
} from "../../../core/utils/constants";

// Google OAuth callback controller
const googleCallback = (req: Request, res: Response) => {
  try {
    const user = req.user as IUser | undefined;

    if (!user) {
      res.status(401).json({ message: "Authentication failed" });
      return;
    }

    const refreshToken = generateRefreshToken(user);

    res.cookie(
      REFRESH_TOKEN_COOKIE_NAME,
      refreshToken,
      REFRESH_TOKEN_COOKIE_OPTIONS
    );

    res.redirect(`${process.env.CORS_ORIGIN}`);
  } catch (err) {
    console.error("Error during Google callback:", err);
    res.status(500).json({
      message: "An unexpected error occurred, please try again later.",
    });
  }
};

export default googleCallback;
