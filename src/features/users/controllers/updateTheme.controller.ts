import { Request, Response, NextFunction } from "express";
import updateThemeSchema from "../validation/updateTheme.validation";
import User, { IUser } from "../model/user.model";
import validateRequest from "../../../core/utils/validate";
import { NotFoundError } from "../../../core/utils/errors";

const updateTheme = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user as IUser;

    const { defaultTheme } = validateRequest(req.body, updateThemeSchema);

    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { defaultTheme },
      { new: true }
    );

    if (!updatedUser) {
      throw new NotFoundError("User not found");
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
};

export default updateTheme;
