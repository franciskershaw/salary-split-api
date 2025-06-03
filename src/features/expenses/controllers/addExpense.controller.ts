import { Request, Response, NextFunction } from "express";
import Account from "../../accounts/model/account.model";
import Expense from "../model/expense.model";
import User from "../../users/model/user.model";
import validateRequest from "../../../core/utils/validate";
import expenseSchema from "../validation/expense.validation";
import { ConflictError, NotFoundError } from "../../../core/utils/errors";

const addExpense = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const value = validateRequest(req.body, expenseSchema);

    const [user, existingExpenses, expenseCount] = await Promise.all([
      User.findById(req.user),
      Expense.find({ createdBy: req.user, name: value.name }).countDocuments(),
      Expense.countDocuments({ createdBy: req.user }),
    ]);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    if (existingExpenses > 0) {
      throw new ConflictError("You've used that name already");
    }

    const account = await Account.findOne({
      _id: value.account,
      createdBy: user._id,
    });

    if (!account) {
      throw new NotFoundError("Account not found");
    }

    const expense = new Expense({
      ...value,
      order: expenseCount,
      createdBy: user._id,
    });

    await expense.save();

    res.status(201).json(expense);
  } catch (error) {
    next(error);
  }
};

export default addExpense;
