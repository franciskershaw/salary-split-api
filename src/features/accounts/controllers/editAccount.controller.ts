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
    session.startTransaction();

    const value = validateRequest(req.body, accountSchema);
    const { accountId } = req.params;
    const { isDefault, acceptsFunds } = value;

    // Separate fields to update vs fields to unset
    const updateFields: any = { ...value };
    const unsetFields: any = {};

    // Check for null values and move them to unset
    if (value.targetMonthlyAmount === null) {
      delete updateFields.targetMonthlyAmount;
      unsetFields.targetMonthlyAmount = "";
    }

    // Build the update operation
    const updateOperation: any = {};
    if (Object.keys(updateFields).length > 0) {
      updateOperation.$set = updateFields;
    }
    if (Object.keys(unsetFields).length > 0) {
      updateOperation.$unset = unsetFields;
    }

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

    // Block manual amount changes when transaction tracking is enabled
    if (account.trackTransactions && value.amount !== account.amount) {
      throw new BadRequestError(
        "Cannot manually update amount when transaction tracking is enabled. Balance is automatically calculated from transactions."
      );
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

    const updatedAccount = await Account.findByIdAndUpdate(
      accountId, 
      updateOperation,
      { session, new: true }
    );

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
