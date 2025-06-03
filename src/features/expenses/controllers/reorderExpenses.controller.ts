import { Request, Response, NextFunction } from "express";
import Expense from "../model/expense.model";
import { ForbiddenError } from "../../../core/utils/errors";
import validateRequest from "../../../core/utils/validate";
import reorderExpensesSchema from "../validation/reorderExpense.validation";

const reorderExpenses = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const expenseIds = validateRequest(req.body, reorderExpensesSchema);
    const userId = req.user;

    // Verify all accounts belong to user
    const expenses = await Expense.find({
      _id: { $in: expenseIds },
      createdBy: userId,
    });

    if (expenses.length !== expenseIds.length) {
      throw new ForbiddenError(
        "Some expenses do not exist or you don't have access"
      );
    }

    // Update all accounts
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

    res.status(200).json(updatedExpenses);
  } catch (error) {
    next(error);
  }
};

export default reorderExpenses;
