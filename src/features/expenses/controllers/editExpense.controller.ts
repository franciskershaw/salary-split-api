import { Request, Response, NextFunction } from "express";
import Expense from "../model/expense.model";
import User from "../../users/model/user.model";
import validateRequest from "../../../core/utils/validate";
import expenseSchema from "../validation/expense.validation";
import { ConflictError } from "../../../core/utils/errors";
import { NotFoundError } from "../../../core/utils/errors";

const editExpense = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const value = validateRequest(req.body, expenseSchema);
    const { expenseId } = req.params;

    const [user, existingExpense] = await Promise.all([
      User.findById(req.user),
      Expense.findById(expenseId),
    ]);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    if (!existingExpense) {
      throw new NotFoundError("Expense not found");
    }

    // Only check for name uniqueness if the name is being changed
    if (value.name !== existingExpense.name) {
      const nameExists = await Expense.findOne({
        createdBy: req.user,
        name: value.name,
        _id: { $ne: expenseId }, // Exclude current expense from check
      });

      if (nameExists) {
        throw new ConflictError("You've used that name already");
      }
    }

    const expense = await Expense.findByIdAndUpdate(expenseId, value, {
      new: true,
    });

    res.status(200).json(expense);
  } catch (error) {
    next(error);
  }
};

export default editExpense;
