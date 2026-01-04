import Expense from "../model/expense.model";
import { createAddController } from "../../shared/recurring-items/add.controller";
import { createEditController } from "../../shared/recurring-items/edit.controller";
import { createDeleteController } from "../../shared/recurring-items/delete.controller";
import { createGetController } from "../../shared/recurring-items/get.controller";
import { createReorderController } from "../../shared/reorder/reorder.controller";

const expenseController = {
  addExpense: createAddController(Expense),
  editExpense: createEditController(Expense),
  deleteExpense: createDeleteController(Expense),
  getExpenses: createGetController(Expense),
  reorderExpenses: createReorderController(Expense, "expense"),
};

export default expenseController;
