import { Request, Response, NextFunction } from "express";
import updateSalarySchema from "../validation/salary.user.validation";
import User, { IUser } from "../model/user.model";
import validateRequest from "../../../core/utils/validate";
import { NotFoundError } from "../../../core/utils/errors";

const updateSalary = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user as IUser;

    const { salary } = validateRequest(req.body, updateSalarySchema);

    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { takeHomePay: salary },
      { new: true }
    );

    if (!updatedUser) {
      throw new NotFoundError("User not found");
    }

    res.status(200).json({
      message: "Salary updated successfully",
      takeHomePay: updatedUser.takeHomePay,
    });
  } catch (error) {
    next(error);
  }
};

export default updateSalary;
