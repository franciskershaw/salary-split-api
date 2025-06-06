import { NextFunction, Request, Response } from "express";
import Expense from "../model/expense.model";
import { NotFoundError } from "../../../core/utils/errors";
import User from "../../users/model/user.model";

const deleteExpense = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user;
    const user = await User.findById(userId);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    const { expenseId } = req.params;
    const expense = await Expense.findById(expenseId);
    if (!expense || expense.createdBy.toString() !== user._id.toString()) {
      throw new NotFoundError("Expense not found");
    }

    await Expense.findByIdAndDelete(expenseId);

    res.status(200).json({ message: "Expense deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export default deleteExpense;
