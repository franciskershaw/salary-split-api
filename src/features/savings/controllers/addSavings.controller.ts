import { Request, Response, NextFunction } from "express";
import Account from "../../accounts/model/account.model";
import Savings from "../model/savings.model";
import User from "../../users/model/user.model";
import validateRequest from "../../../core/utils/validate";
import savingsSchema from "../validation/savings.validation";
import { ConflictError, NotFoundError } from "../../../core/utils/errors";

const addSavings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const value = validateRequest(req.body, savingsSchema);

    const [user, existingSavings, savingsCount] = await Promise.all([
      User.findById(req.user),
      Savings.find({ createdBy: req.user, name: value.name }).countDocuments(),
      Savings.countDocuments({ createdBy: req.user }),
    ]);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    if (existingSavings > 0) {
      throw new ConflictError("You've used that name already");
    }

    const account = await Account.findOne({
      _id: value.account,
      createdBy: user._id,
    });

    if (!account) {
      throw new NotFoundError("Account not found");
    }

    const savings = new Savings({
      ...value,
      order: savingsCount,
      createdBy: user._id,
    });

    await savings.save();

    res.status(201).json(savings);
  } catch (error) {
    next(error);
  }
};

export default addSavings;
