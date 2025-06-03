import { NextFunction, Request, Response } from "express";
import validateRequest from "../../../core/utils/validate";
import Account from "../model/account.model";
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} from "../../../core/utils/errors";
import accountSchema from "../validation/account.validation";
import User from "../../users/model/user.model";
import mongoose from "mongoose";

const editAccount = async (req: Request, res: Response, next: NextFunction) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const value = validateRequest(req.body, accountSchema);
    const { accountId } = req.params;
    const { isDefault, acceptsFunds } = value;

    const [user, account] = await Promise.all([
      User.findById(req.user),
      Account.findById(accountId),
    ]);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    if (!account) {
      throw new NotFoundError("Account not found");
    }

    if (account.createdBy.toString() !== user._id.toString()) {
      throw new ForbiddenError("You are not authorized to edit this account");
    }

    if (isDefault === false && user.defaultAccount?.toString() === accountId) {
      throw new BadRequestError("You cannot remove the default account");
    }

    if (isDefault === true && acceptsFunds === false) {
      throw new BadRequestError("Your default account must accept funds");
    }

    const [updatedUser, updatedAccount] = await Promise.all([
      isDefault
        ? User.findByIdAndUpdate(
            user._id,
            { defaultAccount: accountId },
            { session, new: true }
          )
        : Promise.resolve(null),
      Account.findByIdAndUpdate(accountId, value, { session, new: true }),
    ]);

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      updatedAccount,
      ...(updatedUser && { updatedUser }),
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

export default editAccount;
