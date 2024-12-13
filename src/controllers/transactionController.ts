// @ts-nocheck

import { Request, Response, NextFunction } from "express";
import Transaction from "../models/Transaction";
import User from "../models/User";
import Account from "../models/Account";
import {
  addTransactionSchema,
  updateTransactionSchema,
} from "../validation/joiSchemas";
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
} from "../errors/errors";

const getTransactions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { transactions: transactionIds } = await User.findById(req.user._id);
    const transactions = await Transaction.find({
      _id: { $in: transactionIds },
    });
    res.status(200).json(transactions);
  } catch (err) {
    next(err);
  }
};

const addTransaction = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { error, value } = addTransactionSchema.validate(req.body);
    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    const { name, amount, sendToAccount, type } = value;

    // Make sure the user hasn't already used transaction name already
    const userId = req.user._id;
    const nameInUse = await Transaction.findOne({
      user: userId,
      name: value.name,
    });
    if (nameInUse) {
      throw new ConflictError("You've used that name already");
    }

    // Make sure user is not creating transaction with invalid 'sendToAccount'
    const account = await Account.findById(sendToAccount);
    if (!account.acceptsFunds) {
      throw new BadRequestError("This account does not accept funds directly");
    }

    const transaction = new Transaction({
      user: userId,
      name,
      amount,
      sendToAccount,
      type,
    });
    await transaction.save();

    // update user object 'transactions' array to include new _id
    const user = await User.findById(userId);
    user.transactions.push(transaction._id);
    await user.save();

    res.status(201).json({ transaction });
  } catch (err) {
    next(err);
  }
};

const editTransaction = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const transaction = await Transaction.findById(req.params.transactionId);

    if (!transaction) {
      throw new NotFoundError("Transaction not found");
    }

    const { error, value } = updateTransactionSchema.validate(req.body);
    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    // Make sure user is not updating 'sendToAccount' to an invalid _id
    if (req.body.sendToAccount) {
      const account = await Account.findById(req.body.sendToAccount);
      if (!account.acceptsFunds) {
        throw new BadRequestError(
          "This account does not accept funds directly"
        );
      }
    }

    const updatedTransaction = await Transaction.findByIdAndUpdate(
      req.params.transactionId,
      value,
      { new: true }
    );

    res.status(200).json(updatedTransaction);
  } catch (err) {
    next(err);
  }
};

const deleteTransaction = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { transactionId } = req.params;
    const transaction = await Transaction.findById(transactionId);
    if (!transaction) {
      throw new NotFoundError("Transaction not found");
    }
    await Transaction.findByIdAndDelete(transactionId);

    // Update user to remove _id from 'transactions' array
    await User.findByIdAndUpdate(
      req.user._id,
      {
        $pull: { transactions: transactionId },
      },
      { new: true }
    );
    res.status(200).json({ deleted: transactionId });
  } catch (err) {
    next(err);
  }
};

export { getTransactions, addTransaction, editTransaction, deleteTransaction };
