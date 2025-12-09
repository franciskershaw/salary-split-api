import express from "express";
import asyncHandler from "express-async-handler";
import { authenticateToken } from "../../auth/middleware/auth.middleware";
import * as accountController from "../controllers/_account.controller";
import * as transactionController from "../../transactions/controllers/_transaction.controller";
import { requireTransactionTracking } from "../../transactions/middlware/transactions.middlware";

const router = express.Router();

router.get("/", authenticateToken, asyncHandler(accountController.getAccounts));
router.post("/", authenticateToken, asyncHandler(accountController.addAccount));
router.put(
  "/reorder",
  authenticateToken,
  asyncHandler(accountController.reorderAccounts)
);
router.put(
  "/:accountId",
  authenticateToken,
  asyncHandler(accountController.editAccount)
);
router.delete(
  "/:accountId",
  authenticateToken,
  asyncHandler(accountController.deleteAccount)
);

// Transaction routes
router.get(
  "/:accountId/transactions",
  authenticateToken,
  asyncHandler(requireTransactionTracking),
  asyncHandler(transactionController.getTransactions)
);
router.post(
  "/:accountId/transactions",
  authenticateToken,
  asyncHandler(requireTransactionTracking),
  asyncHandler(transactionController.addTransaction)
);
router.put(
  "/:accountId/transactions/:transactionId",
  authenticateToken,
  asyncHandler(requireTransactionTracking),
  asyncHandler(transactionController.editTransaction)
);
router.delete(
  "/:accountId/transactions/:transactionId",
  authenticateToken,
  asyncHandler(requireTransactionTracking),
  asyncHandler(transactionController.deleteTransaction)
);

export default router;
