import { Context } from "hono";
import Account from "../model/account.model";
import { BadRequestError, NotFoundError } from "../../../core/utils/errors";
import User from "../../users/model/user.model";
import Bill from "../../bills/model/bill.model";

const deleteAccount = async (c: Context) => {
  const userId = c.get("user")._id;
  const user = await User.findById(userId);

  if (!user) {
    throw new NotFoundError("User not found");
  }

  const accountId = c.req.param("accountId");
  const account = await Account.findById(accountId);
  if (!account || account.createdBy.toString() !== user._id.toString()) {
    throw new NotFoundError("Account not found");
  }

  if (user.defaultAccount?.toString() === accountId) {
    throw new BadRequestError("You cannot delete your default account");
  }

  const bills = await Bill.find({ account: accountId });
  if (bills.length > 0) {
    throw new BadRequestError(
      "Account is linked to a bill, please change the account on the bill before deleting"
    );
  }

  await Account.findByIdAndDelete(accountId);

  return c.json({ message: "Account deleted successfully" }, 200);
};

export default deleteAccount;
