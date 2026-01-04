import { Hono } from "hono";
import { authenticate } from "../../../core/middleware/auth.middleware";
import validateObjectId from "../../../core/middleware/validateObjectId.middleware";
import expenseController from "../controllers/_expense.controller";
import { validate } from "../../../core/utils/validate";
import { expenseSchema } from "../validation/expense.validation";
import { reorderExpensesSchema } from "../validation/reorderExpense.validation";

const expenseRoutes = new Hono();

expenseRoutes.get("/", authenticate, expenseController.getExpenses);

expenseRoutes.post(
  "/",
  authenticate,
  validate("json", expenseSchema),
  expenseController.addExpense
);

expenseRoutes.put(
  "/reorder",
  authenticate,
  validate("json", reorderExpensesSchema),
  expenseController.reorderExpenses
);

expenseRoutes.put(
  "/:expenseId",
  authenticate,
  validateObjectId("expenseId"),
  validate("json", expenseSchema),
  expenseController.editExpense
);

expenseRoutes.delete(
  "/:expenseId",
  authenticate,
  validateObjectId("expenseId"),
  expenseController.deleteExpense
);

export default expenseRoutes;
