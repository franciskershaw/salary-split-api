import { NextFunction, Request, Response } from "express";
import updateAccountFiltersSchema from "../validation/accountFilters.user.validation";
import validateRequest from "../../../core/utils/validate";
import User from "../model/user.model";
import { NotFoundError } from "../../../core/utils/errors";

const updateAccountFilters = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const accountFilters = validateRequest(
      req.body,
      updateAccountFiltersSchema
    );

    const user = await User.findById(req.user);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { accountFilters },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
};

export default updateAccountFilters;
