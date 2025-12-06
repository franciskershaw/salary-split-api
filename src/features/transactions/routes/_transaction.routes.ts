import express from "express";
import asyncHandler from "express-async-handler";
import { authenticateToken } from "../../auth/middleware/auth.middleware";
import * as transactionController from "../controllers/_transaction.controller";

const router = express.Router();

router.get(
  "/",
  authenticateToken,
  asyncHandler(transactionController.getTransactions)
);
router.post(
  "/",
  authenticateToken,
  asyncHandler(transactionController.addTransaction)
);
router.put(
  "/:transactionId",
  authenticateToken,
  asyncHandler(transactionController.editTransaction)
);
router.delete(
  "/:transactionId",
  authenticateToken,
  asyncHandler(transactionController.deleteTransaction)
);

export default router;
