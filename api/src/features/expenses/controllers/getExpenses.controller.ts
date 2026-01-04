import { Context } from "hono";
import Expense from "../model/expense.model";

const getExpenses = async (c: Context) => {
  const userId = c.get("user")._id;
  const expenses = await Expense.find({ createdBy: userId })
    .populate("account")
    .sort({ order: 1 });

  return c.json(expenses, 200);
};

export default getExpenses;
