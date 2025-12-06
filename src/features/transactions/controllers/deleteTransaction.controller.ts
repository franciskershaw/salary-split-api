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
    const user = await User.findById(userId);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    const { transactionId } = req.params;
    const transaction = await Transaction.findById(transactionId);
    if (
      !transaction ||
      transaction.createdBy.toString() !== user._id.toString()
    ) {
      throw new NotFoundError("Transaction not found");
    }

    await Transaction.findByIdAndDelete(transactionId);

    res.status(200).json({ message: "Transaction deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export default deleteTransaction;
