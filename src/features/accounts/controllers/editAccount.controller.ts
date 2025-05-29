import { NextFunction, Request, Response } from "express";
import validateRequest from "../../../core/utils/validate";
import Account from "../model/account.model";
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} from "../../../core/utils/errors";
import editAccountSchema from "../validation/editAccount.validation";
import User from "../../users/model/user.model";
import mongoose from "mongoose";

const editAccount = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const value = validateRequest(req.body, editAccountSchema);
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

    if (isDefault === true) {
      const session = await mongoose.startSession();
      session.startTransaction();

      try {
        const [updatedUser, updatedAccount] = await Promise.all([
          User.findByIdAndUpdate(
            user._id,
            { defaultAccount: accountId },
            { session, new: true }
          ),
          Account.findByIdAndUpdate(accountId, value, { session, new: true }),
        ]);

        await session.commitTransaction();
        session.endSession();

        res.status(200).json({ updatedAccount, updatedUser });
      } catch (err) {
        await session.abortTransaction();
        session.endSession();
        throw err;
      }
    } else {
      const updatedAccount = await Account.findByIdAndUpdate(accountId, value, {
        new: true,
      });
      res.status(200).json(updatedAccount);
    }
  } catch (error) {
    next(error);
  }
};

export default editAccount;
