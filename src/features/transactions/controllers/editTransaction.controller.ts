import { Request, Response, NextFunction } from "express";
import Category from "../../categories/model/category.model";
import Transaction from "../model/transaction.model";
import User from "../../users/model/user.model";
import Account from "../../accounts/model/account.model";
import validateRequest from "../../../core/utils/validate";
import transactionSchema from "../validation/transaction.validation";
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} from "../../../core/utils/errors";
import mongoose from "mongoose";

const editTransaction = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let session;
  try {
    const account = req.account!;
    const { transactionId } = req.params;
    const value = validateRequest(req.body, transactionSchema);

    // Start MongoDB transaction for atomic balance update
    session = await mongoose.startSession();
    session.startTransaction();

    const [user, existingTransaction] = await Promise.all([
      User.findById(req.user).session(session),
      Transaction.findById(transactionId).session(session),
    ]);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    if (!existingTransaction) {
      throw new NotFoundError("Transaction not found");
    }

    // Verify ownership
    if (existingTransaction.createdBy.toString() !== user._id.toString()) {
      throw new ForbiddenError(
        "You are not authorized to edit this transaction"
      );
    }

    // Verify transaction belongs to the account in the URL
    if (existingTransaction.account.toString() !== account._id.toString()) {
      throw new NotFoundError("Transaction not found in this account");
    }

    // Calculate old and new transaction amounts
    const oldAmount = existingTransaction.splits.reduce(
      (sum, split) => sum + split.amount,
      0
    );
    const newAmount = value.splits.reduce(
      (sum: number, split: any) => sum + split.amount,
      0
    );
    const balanceDifference = newAmount - oldAmount;

    // Validate all categories exist and belong to user
    const categoryIds = value.splits.map((split: any) => split.category);
    const categories = await Category.find({
      _id: { $in: categoryIds },
      createdBy: user._id,
    }).session(session);

    if (categories.length !== categoryIds.length) {
      throw new NotFoundError(
        "One or more categories not found or do not belong to you"
      );
    }

    // If transfer type, validate transferToAccount
    if (value.type === "transfer") {
      if (!value.transferToAccount) {
        throw new BadRequestError(
          "Transfer destination account is required for transfer transactions"
        );
      }

      const transferAccount = await Account.findOne({
        _id: value.transferToAccount,
        createdBy: user._id,
      }).session(session);

      if (!transferAccount) {
        throw new NotFoundError("Transfer destination account not found");
      }

      // Prevent transfer to the same account
      if (account._id.toString() === value.transferToAccount) {
        throw new BadRequestError("Cannot transfer to the same account");
      }
    }

    const transaction = await Transaction.findByIdAndUpdate(
      transactionId,
      { ...value, account: account._id },
      { new: true, session }
    );

    // Update account balance with the difference
    if (balanceDifference !== 0) {
      await Account.findByIdAndUpdate(
        account._id,
        {
          $inc: { amount: balanceDifference },
        },
        { session }
      );
    }

    await session.commitTransaction();

    res.status(200).json(transaction);
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

export default editTransaction;
