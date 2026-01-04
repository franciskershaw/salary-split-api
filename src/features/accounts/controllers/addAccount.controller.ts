import { Context } from "hono";
import Account from "../model/account.model";
import mongoose from "mongoose";
import User from "../../users/model/user.model";
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
} from "../../../core/utils/errors";

const addAccount = async (c: Context) => {
  let session;
  try {
    session = await mongoose.startSession();
    session.startTransaction();

    const userId = c.get("user")._id;
    const user = await User.findById(userId).session(session).exec();

    if (!user) {
      throw new NotFoundError("User not found");
    }

    const body = await c.req.json();

    const existingAccounts = await Account.find({
      createdBy: userId,
      name: body.name,
    })
      .countDocuments()
      .session(session)
      .exec();

    if (existingAccounts > 0) {
      throw new ConflictError("You've used that name already");
    }

    // Check if this is the user's first account
    const isFirstAccount = !user.defaultAccount;
    if (isFirstAccount && !body.acceptsFunds) {
      throw new BadRequestError("Your default account must accept funds");
    }

    const accountCount = await Account.countDocuments({
      createdBy: userId,
    })
      .session(session)
      .exec();

    const newAccount = await new Account({
      ...body,
      order: accountCount + 1,
      createdBy: userId,
    });

    // Save the account first
    await newAccount.save({ session });

    // Update the user's default account if needed
    if (isFirstAccount || body.isDefault) {
      await User.findByIdAndUpdate(
        userId,
        { defaultAccount: newAccount._id },
        { session, new: true }
      );
    }

    await session.commitTransaction();

    return c.json(newAccount, 201);
  } catch (error) {
    if (session) {
      await session.abortTransaction();
    }
    throw error;
  } finally {
    if (session) {
      await session.endSession();
    }
  }
};

export default addAccount;
