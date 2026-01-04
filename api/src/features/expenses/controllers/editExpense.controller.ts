import { Context } from "hono";
import Expense from "../model/expense.model";
import User from "../../users/model/user.model";
import { ConflictError, NotFoundError } from "../../../core/utils/errors";

const editExpense = async (c: Context) => {
  const userId = c.get("user")._id;
  const expenseId = c.req.param("expenseId");
  const body = await c.req.json();

  const [user, existingExpense] = await Promise.all([
    User.findById(userId),
    Expense.findById(expenseId),
  ]);

  if (!user) {
    throw new NotFoundError("User not found");
  }

  if (!existingExpense) {
    throw new NotFoundError("Expense not found");
  }

  // Only check for name uniqueness if the name is being changed
  if (body.name !== existingExpense.name) {
    const nameExists = await Expense.findOne({
      createdBy: userId,
      name: body.name,
      _id: { $ne: expenseId }, // Exclude current expense from check
    });

    if (nameExists) {
      throw new ConflictError("You've used that name already");
    }
  }

  const expense = await Expense.findByIdAndUpdate(expenseId, body, {
    new: true,
  });

  return c.json(expense, 200);
};

export default editExpense;
