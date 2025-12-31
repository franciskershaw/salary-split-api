import { Context } from "hono";
import Account from "../model/account.model";
import { BadRequestError, NotFoundError } from "../../../core/utils/errors";
import User from "../../users/model/user.model";
import mongoose from "mongoose";

const editAccount = async (c: Context) => {
  let session;
  try {
    session = await mongoose.startSession();
    session.startTransaction();

    const userId = c.get("user")._id;
    const body = await c.req.json();
    const accountId = c.req.param("accountId");

    // Separate fields to update vs fields to unset
    const updateFields: any = { ...body };
    const unsetFields: any = {};

    // Check for null values and move them to unset
    if (body.targetMonthlyAmount === null) {
      delete updateFields.targetMonthlyAmount;
      unsetFields.targetMonthlyAmount = "";
    }

    // Build the update operation
    const updateOperation: any = {};
    if (Object.keys(updateFields).length > 0) {
      updateOperation.$set = updateFields;
    }
    if (Object.keys(unsetFields).length > 0) {
      updateOperation.$unset = unsetFields;
    }

    // Use withTransaction to ensure proper session handling
    const user = await User.findById(userId).session(session);
    const account = await Account.findById(accountId).session(session);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    if (!account) {
      throw new NotFoundError("Account not found");
    }

    if (account.createdBy.toString() !== user._id.toString()) {
      throw new NotFoundError("Account not found");
    }

    if (
      body.isDefault === false &&
      user.defaultAccount?.toString() === accountId
    ) {
      throw new BadRequestError("You cannot remove the default account");
    }

    if (body.isDefault === true && body.acceptsFunds === false) {
      throw new BadRequestError("Your default account must accept funds");
    }

    let updatedUser = null;
    if (body.isDefault) {
      updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          defaultAccount: accountId,
        },
        { session, new: true }
      );
    }

    const updatedAccount = await Account.findByIdAndUpdate(
      accountId,
      updateOperation,
      { session, new: true }
    );

    await session.commitTransaction();

    return c.json({ updatedAccount, ...(updatedUser && { updatedUser }) });
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

export default editAccount;
