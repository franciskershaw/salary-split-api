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

const editTransaction = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { accountId, transactionId } = req.params;
    const value = validateRequest(req.body, transactionSchema);

    const [user, existingTransaction] = await Promise.all([
      User.findById(req.user),
      Transaction.findById(transactionId),
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
    if (existingTransaction.account.toString() !== accountId) {
      throw new NotFoundError("Transaction not found in this account");
    }

    // Ensure account in body matches account in URL
    if (value.account !== accountId) {
      throw new BadRequestError(
        "Account ID in request body must match the account in the URL"
      );
    }

    // Validate all categories exist and belong to user
    const categoryIds = value.splits.map((split: any) => split.category);
    const categories = await Category.find({
      _id: { $in: categoryIds },
      createdBy: user._id,
    });

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
      });

      if (!transferAccount) {
        throw new NotFoundError("Transfer destination account not found");
      }

      // Prevent transfer to the same account
      if (value.account === value.transferToAccount) {
        throw new BadRequestError("Cannot transfer to the same account");
      }
    }

    const transaction = await Transaction.findByIdAndUpdate(
      transactionId,
      value,
      { new: true }
    );

    res.status(200).json(transaction);
  } catch (error) {
    next(error);
  }
};

export default editTransaction;
