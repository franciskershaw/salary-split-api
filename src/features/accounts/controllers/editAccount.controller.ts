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
  let session;
  try {
    session = await mongoose.startSession();
    await session.startTransaction();

    const value = validateRequest(req.body, accountSchema);
    const { accountId } = req.params;
    const { isDefault, acceptsFunds } = value;

    // Use withTransaction to ensure proper session handling
    const user = await User.findById(req.user).session(session);
    const account = await Account.findById(accountId).session(session);

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

    let updatedUser = null;
    if (isDefault) {
      updatedUser = await User.findByIdAndUpdate(
        user._id,
        { defaultAccount: accountId },
        { session, new: true }
      );
    }

    const updatedAccount = await Account.findByIdAndUpdate(accountId, value, {
      session,
      new: true,
    });

    await session.commitTransaction();

    res.status(200).json({
      updatedAccount,
      ...(updatedUser && { updatedUser }),
    });
  } catch (error) {
    if (session) {
      await session.abortTransaction();
    }
    next(error);
  } finally {
    if (session) {
      session.endSession();
    }
  }
};

export default editAccount;
