import { NextFunction, Request, Response } from "express";
import Transaction from "../model/transaction.model";
import { NotFoundError } from "../../../core/utils/errors";
import User from "../../users/model/user.model";

const deleteTransaction = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user;
    const { accountId, transactionId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    const transaction = await Transaction.findById(transactionId);
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

    await Transaction.findByIdAndDelete(transactionId);

    res.status(200).json({ message: "Transaction deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export default deleteTransaction;
