import addExpense from "./addExpense.controller";
import editExpense from "./editExpense.controller";
import deleteExpense from "./deleteExpense.controller";
import getExpenses from "./getExpenses.controller";
import reorderExpenses from "./reorderExpenses.controller";

const expenseController = {
  addExpense,
  editExpense,
  deleteExpense,
  getExpenses,
  reorderExpenses,
};

export default expenseController;
