import { Request, Response, NextFunction } from "express";
import User, { IUser } from "../model/user.model";
import { NotFoundError } from "../../../core/utils/errors";
import { sendTokensAndUser } from "../../auth/utils/auth.helper";

const getUserInfo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById((req.user as IUser)._id).lean();

    if (!user) {
      throw new NotFoundError("User not found");
    }

    sendTokensAndUser(res, user as IUser);
  } catch (err) {
    next(err);
  }
};

export default getUserInfo;
