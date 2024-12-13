// @ts-nocheck

import { Request, Response, NextFunction } from "express";
import Account from "../models/Account";
import User, { IUser } from "../models/User";
import Transaction from "../models/Transaction";
import {
  addAccountSchema,
  updateAccountSchema,
} from "../validation/joiSchemas";
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
} from "../errors/errors";

const getAccounts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { accounts: accountIds } = await User.findById(req.user._id);
    const accounts = await Account.find({ _id: { $in: accountIds } });
    res.status(200).json(accounts);
  } catch (err) {
    next(err);
  }
};

const addAccount = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { error, value } = addAccountSchema.validate(req.body);
    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    const { name, amount, acceptsFunds, excludeFromTotal } = value;

    const nameInUse = await Account.findOne({
      user: req.user._id,
      name,
    });
    if (nameInUse) {
      throw new ConflictError("You've used that name already");
    }

    /* 
      Make sure first account added is the 'default' account
      and therefore accepts funds
    */

    const user = await User.findById(req.user._id);

    if (user.accounts < 1 && acceptsFunds === false) {
      throw new BadRequestError("Your default account must accept funds");
    }

    const account = new Account({
      name,

      user: req.user._id,
      amount,
      acceptsFunds,
      excludeFromTotal,
    });

    await account.save();

    // Sets the default account if this is the first account added

    if (user.accounts < 1) {
      user.defaultAccount = account._id;
    }
    // Adds account _id to accounts array in user object
    user.accounts.push(account._id);
    await user.save();

    res.status(201).json({ account });
  } catch (err) {
    next(err);
  }
};

const editAccount = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const account = await Account.findById(req.params.accountId);

    if (!account) {
      throw new NotFoundError("Account not found");
    }

    /* 
      mergedData to ensure validation works as
      there are extra fields that are not in the JOI schema but
      are automatically stored in MongoDB
    */
    const mergedData = { ...account.toObject(), ...req.body };
    // Remove unwanted properties from mergedData
    delete mergedData._id;
    delete mergedData.user;
    delete mergedData.__v;

    // use mergedData for the validation instead of req.body
    const { error, value } = updateAccountSchema.validate(mergedData);
    if (error) {
      throw new BadRequestError(error.details[0].message);
    }

    // Use only the updated fields from the request body
    const updatedFields = {};
    for (const key in req.body) {
      updatedFields[key] = value[key];
    }

    const user = await User.findById(req.user._id);
    /*
      Halt update if attempting to change 'acceptsFunds' to false on 
      default acount as this is not allowed
    */
    if (
      user.defaultAccount.equals(req.params.accountId) &&
      value.acceptsFunds === false
    ) {
      throw new BadRequestError("Default account must accept funds");
    }

    // Finally, if everything else has passed, update the account
    const updatedAccount = await Account.findByIdAndUpdate(
      req.params.accountId,
      updatedFields,
      { new: true }
    );

    res.status(200).json(updatedAccount);
  } catch (err) {
    next(err);
  }
};

const deleteAccount = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { accountId } = req.params;
    const account = await Account.findById(accountId);
    if (!account) {
      throw new NotFoundError("Account not found");
    }

    // Do not allow default accounts to be deleted

    const user = await User.findById(req.user._id);
    if (user.defaultAccount.equals(accountId)) {
      throw new BadRequestError("Cannot delete default account");
    }

    /*
      Find transactions that have the deleted account as 
      'sendToAccount' as they will need to have the default
      account set as their new 'sendToAccount'
    */
    const affectedTransactions = await Transaction.find({
      sendToAccount: account._id,
    });

    if (affectedTransactions.length) {
      for (let transaction of affectedTransactions) {
        transaction.sendToAccount = user.defaultAccount;
        await transaction.save();
      }
    }

    // Delete account
    await Account.findByIdAndDelete(accountId);

    // Update user 'accounts' array to remove deleted _id
    await User.findByIdAndUpdate(
      req.user._id,
      {
        $pull: { accounts: accountId },
      },
      { new: true }
    );

    res.status(200).json({ deleted: accountId });
  } catch (err) {
    next(err);
  }
};

export { getAccounts, addAccount, editAccount, deleteAccount };
