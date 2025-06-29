import { Request, Response, NextFunction } from "express";
import Account from "../model/account.model";
import User from "../../users/model/user.model";
import validateRequest from "../../../core/utils/validate";
import accountSchema from "../validation/account.validation";
import {
  ConflictError,
  NotFoundError,
  BadRequestError,
} from "../../../core/utils/errors";
import mongoose from "mongoose";

const addAccount = async (req: Request, res: Response, next: NextFunction) => {
  let session;
  try {
    const value = validateRequest(req.body, accountSchema);

    session = await mongoose.startSession();
    session.startTransaction();

    const user = await User.findById(req.user).session(session).exec();

    if (!user) {
      throw new NotFoundError("User not found");
    }

    const existingAccounts = await Account.find({
      createdBy: req.user,
      name: value.name,
    })
      .countDocuments()
      .session(session)
      .exec();

    if (existingAccounts > 0) {
      throw new ConflictError("You've used that name already");
    }

    // Check if this is the user's first account
    const isFirstAccount = !user.defaultAccount;
    if (isFirstAccount && !value.acceptsFunds) {
      throw new BadRequestError("Your default account must accept funds");
    }

    const accountCount = await Account.countDocuments({
      createdBy: user._id,
    })
      .session(session)
      .exec();

    const account = new Account({
      ...value,
      order: accountCount,
      createdBy: user._id,
    });

    // Save account first
    await account.save({ session });

    // Update user's default account if needed
    if (isFirstAccount || value.isDefault) {
      await User.findByIdAndUpdate(
        user._id,
        { defaultAccount: account._id },
        { session, new: true }
      );
    }

    await session.commitTransaction();

    res.status(201).json(account);
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

export default addAccount;
