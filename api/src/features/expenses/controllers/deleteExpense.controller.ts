import { Context } from "hono";
import Expense from "../model/expense.model";
import User from "../../users/model/user.model";
import { NotFoundError } from "../../../core/utils/errors";

const deleteExpense = async (c: Context) => {
  const user = await User.findById(c.get("user")._id);

  if (!user) {
    throw new NotFoundError("User not found");
  }

  const expenseId = c.req.param("expenseId");
  const expense = await Expense.findById(expenseId);

  if (!expense || expense.createdBy.toString() !== user._id.toString()) {
    throw new NotFoundError("Expense not found");
  }

  await Expense.findByIdAndDelete(expenseId);

  return c.json({ message: "Expense deleted successfully" }, 200);
};

export default deleteExpense;
