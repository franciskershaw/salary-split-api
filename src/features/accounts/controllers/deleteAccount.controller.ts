import { NextFunction, Request, Response } from "express";
import Account from "../model/account.model";
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} from "../../../core/utils/errors";
import User from "../../users/model/user.model";
import Bill from "../../bills/model/bill.model";

const deleteAccount = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user;
    const user = await User.findById(userId);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    const { accountId } = req.params;
    const account = await Account.findById(accountId);
    if (!account || account.createdBy.toString() !== user._id.toString()) {
      throw new NotFoundError("Account not found");
    }

    if (user.defaultAccount?.toString() === accountId) {
      throw new BadRequestError("You cannot remove the default account");
    }

    const bills = await Bill.find({ account: accountId });
    if (bills.length > 0) {
      throw new BadRequestError(
        "Account is linked to a bill, please change the account on the bill before deleting"
      );
    }

    await Account.findByIdAndDelete(accountId);

    res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export default deleteAccount;
