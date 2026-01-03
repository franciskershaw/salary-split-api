import { Context } from "hono";
import Account from "../../accounts/model/account.model";
import Bill from "../model/bill.model";
import User from "../../users/model/user.model";
import { ConflictError, NotFoundError } from "../../../core/utils/errors";

const addBill = async (c: Context) => {
  const userId = c.get("user")._id;
  const body = await c.req.json();

  const [user, existingBills, billCount] = await Promise.all([
    User.findById(userId),
    Bill.find({ createdBy: userId, name: body.name }).countDocuments(),
    Bill.countDocuments({ createdBy: userId }),
  ]);

  if (!user) {
    throw new NotFoundError("User not found");
  }

  if (existingBills > 0) {
    throw new ConflictError("You've used that name already");
  }

  const account = await Account.findOne({
    _id: body.account,
    createdBy: user._id,
  });

  if (!account) {
    throw new NotFoundError("Account not found");
  }

  const bill = new Bill({
    ...body,
    order: billCount,
    createdBy: user._id,
  });

  await bill.save();

  return c.json(bill, 201);
};

export default addBill;
