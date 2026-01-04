import { Context } from "hono";
import Expense from "../model/expense.model";
import { ForbiddenError } from "../../../core/utils/errors";

const reorderExpenses = async (c: Context) => {
  const userId = c.get("user")._id;
  const expenseIds = await c.req.json();

  // Verify all expenses belong to user
  const expenses = await Expense.find({
    _id: { $in: expenseIds },
    createdBy: userId,
  });

  if (expenses.length !== expenseIds.length) {
    throw new ForbiddenError(
      "Some expenses do not exist or you don't have access"
    );
  }

  // Update all expenses
  const updates = expenseIds.map((expenseId: string, index: number) => ({
    updateOne: {
      filter: { _id: expenseId },
      update: { $set: { order: index } },
    },
  }));

  await Expense.bulkWrite(updates);

  const updatedExpenses = await Expense.find({ createdBy: userId }).sort({
    order: 1,
  });

  return c.json(updatedExpenses, 200);
};

export default reorderExpenses;
