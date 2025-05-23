import { Request, Response, NextFunction } from "express";
import passport from "passport";
import { sendTokensAndUser } from "../utils/auth.helper";
import { IUser } from "../../users/model/user.model";

// Local login controller
const localLogin = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate("local", (err: any, user: IUser | undefined) => {
    if (err) {
      console.error("Authentication error:", err);
      return res.status(500).json({ message: "Internal server error" });
    }

    if (!user) {
      return res.status(401).json({
        message: "Incorrect email or password",
      });
    }

    sendTokensAndUser(res, user, 200);
  })(req, res, next);
};

export default localLogin;