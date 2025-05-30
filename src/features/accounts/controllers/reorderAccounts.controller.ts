import mongoose from "mongoose";
import { Request, Response, NextFunction } from "express";
import Account from "../model/account.model";
import { ForbiddenError } from "../../../core/utils/errors";
import validateRequest from "../../../core/utils/validate";
import reorderAccountsSchema from "../validation/reorderAccounts.validation";

const reorderAccounts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const accountIds = validateRequest(req.body, reorderAccountsSchema);
    const userId = req.user;

    // Verify all accounts belong to user
    const accounts = await Account.find({
      _id: { $in: accountIds },
      createdBy: userId,
    });

    if (accounts.length !== accountIds.length) {
      throw new ForbiddenError(
        "Some accounts do not exist or you don't have access"
      );
    }

    // Update all accounts in a single transaction
    const updates = accountIds.map((accountId: string, index: number) => ({
      updateOne: {
        filter: { _id: accountId },
        update: { $set: { order: index } },
      },
    }));

    await Account.bulkWrite(updates, { session });
    await session.commitTransaction();

    const updatedAccounts = await Account.find({ createdBy: userId }).sort({
      order: 1,
    });

    res.status(200).json(updatedAccounts);
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};

export default reorderAccounts;
