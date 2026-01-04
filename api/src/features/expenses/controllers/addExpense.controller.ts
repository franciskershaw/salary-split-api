import { Context } from "hono";
import Account from "../../accounts/model/account.model";
import Expense from "../model/expense.model";
import User from "../../users/model/user.model";
import { ConflictError, NotFoundError } from "../../../core/utils/errors";

const addExpense = async (c: Context) => {
  const userId = c.get("user")._id;
  const body = await c.req.json();

  const [user, existingExpenses, expenseCount] = await Promise.all([
    User.findById(userId),
    Expense.find({ createdBy: userId, name: body.name }).countDocuments(),
    Expense.countDocuments({ createdBy: userId }),
  ]);

  if (!user) {
    throw new NotFoundError("User not found");
  }

  if (existingExpenses > 0) {
    throw new ConflictError("You've used that name already");
  }

  const account = await Account.findOne({
    _id: body.account,
    createdBy: user._id,
  });

  if (!account) {
    throw new NotFoundError("Account not found");
  }

  const expense = new Expense({
    ...body,
    order: expenseCount,
    createdBy: user._id,
  });

  await expense.save();

  return c.json(expense, 201);
};

export default addExpense;
