import { Request, Response } from "express";
import { REFRESH_TOKEN_COOKIE_NAME } from "../../../core/utils/constants";

// Logout controller
const logout = (req: Request, res: Response) => {
  res.clearCookie(REFRESH_TOKEN_COOKIE_NAME);
  res.json({ message: "Logged out successfully" });
};

export default logout;
