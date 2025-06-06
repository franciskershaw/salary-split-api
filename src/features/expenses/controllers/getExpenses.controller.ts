import { Request, Response, NextFunction } from "express";
import Expense from "../model/expense.model";
import { IUser } from "../../users/model/user.model";

const getExpenses = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user as IUser;
    const expenses = await Expense.find({ createdBy: user._id })
      .populate("account")
      .sort({
        order: 1,
      });
    res.status(200).json(expenses);
  } catch (err) {
    next(err);
  }
};

export default getExpenses;
