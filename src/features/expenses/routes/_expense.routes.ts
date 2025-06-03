import express from "express";
import asyncHandler from "express-async-handler";
import { authenticateToken } from "../../auth/middleware/auth.middleware";
import * as expenseController from "../controllers/_expense.controller";

const router = express.Router();

router.get("/", authenticateToken, asyncHandler(expenseController.getExpenses));
router.post("/", authenticateToken, asyncHandler(expenseController.addExpense));
router.put(
  "/reorder",
  authenticateToken,
  asyncHandler(expenseController.reorderExpenses)
);
router.put(
  "/:billId",
  authenticateToken,
  asyncHandler(expenseController.editExpense)
);
router.delete(
  "/:billId",
  authenticateToken,
  asyncHandler(expenseController.deleteExpense)
);

export default router;
