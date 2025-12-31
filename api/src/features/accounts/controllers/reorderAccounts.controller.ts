import { Context } from "hono";
import Account from "../model/account.model";
import { ForbiddenError } from "../../../core/utils/errors";

const reorderAccounts = async (c: Context) => {
  const userId = c.get("user")._id;
  const accountIds = await c.req.json();

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

  // Update all accounts
  const updates = accountIds.map((accountId: string, index: number) => ({
    updateOne: {
      filter: { _id: accountId },
      update: { $set: { order: index } },
    },
  }));

  await Account.bulkWrite(updates);

  const updatedAccounts = await Account.find({ createdBy: userId }).sort({
    order: 1,
  });

  return c.json(updatedAccounts, 200);
};

export default reorderAccounts;
