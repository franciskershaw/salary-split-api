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
  try {
    const value = validateRequest(req.body, accountSchema);

    const session = await mongoose.startSession();
    session.startTransaction();

    const [user, existingAccounts] = await Promise.all([
      User.findById(req.user),
      Account.find({ createdBy: req.user, name: value.name }).countDocuments(),
    ]);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    if (existingAccounts > 0) {
      throw new ConflictError("You've used that name already");
    }

    // Check if this is the user's first account
    const isFirstAccount = !user.defaultAccount;
    if (isFirstAccount && !value.acceptsFunds) {
      throw new BadRequestError("Your default account must accept funds");
    }

    const accountCount = await Account.countDocuments({ createdBy: user._id });
    const account = new Account({
      ...value,
      order: accountCount,
      createdBy: user._id,
    });

    // If it's the first account, use a transaction to update both documents
    if (isFirstAccount) {
      try {
        await Promise.all([
          account.save({ session }),
          User.findByIdAndUpdate(
            user._id,
            { defaultAccount: account._id },
            { session }
          ),
        ]);
        await session.commitTransaction();
      } catch (err) {
        await session.abortTransaction();
        throw err;
      } finally {
        session.endSession();
      }
    } else {
      await account.save();
    }

    res.status(201).json(account);
  } catch (err) {
    next(err);
  }
};

export default addAccount;
