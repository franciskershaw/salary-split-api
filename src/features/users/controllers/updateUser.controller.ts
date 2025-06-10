import { Request, Response, NextFunction } from "express";
import updateUserSchema from "../validation/updateUser.validation";
import User, { IUser } from "../model/user.model";
import validateRequest from "../../../core/utils/validate";
import { NotFoundError } from "../../../core/utils/errors";

const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user as IUser;

    const value = validateRequest(req.body, updateUserSchema);

    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { ...value },
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

export default updateUser;
