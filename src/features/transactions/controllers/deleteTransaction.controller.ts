import { NextFunction, Request, Response } from "express";
import Transaction from "../model/transaction.model";
import { NotFoundError } from "../../../core/utils/errors";
import User from "../../users/model/user.model";
import Account from "../../accounts/model/account.model";
import mongoose from "mongoose";

const deleteTransaction = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let session;
  try {
    const userId = req.user;
    const { accountId, transactionId } = req.params;

    // Start MongoDB transaction for atomic balance update
    session = await mongoose.startSession();
    session.startTransaction();

    const user = await User.findById(userId).session(session);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    const transaction = await Transaction.findById(transactionId).session(
      session
    );
    if (
      !transaction ||
      transaction.createdBy.toString() !== user._id.toString()
    ) {
      throw new NotFoundError("Transaction not found");
    }

    // Verify transaction belongs to the account in the URL
    if (transaction.account.toString() !== accountId) {
      throw new NotFoundError("Transaction not found in this account");
    }

    // Calculate transaction amount to subtract from balance
    const totalAmount = transaction.splits.reduce(
      (sum, split) => sum + split.amount,
      0
    );

    await Transaction.findByIdAndDelete(transactionId).session(session);

    // Update account balance by subtracting the transaction amount
    await Account.findByIdAndUpdate(
      accountId,
      {
        $inc: { amount: -totalAmount },
      },
      { session }
    );

    await session.commitTransaction();

    res.status(200).json({ message: "Transaction deleted successfully" });
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

export default deleteTransaction;
