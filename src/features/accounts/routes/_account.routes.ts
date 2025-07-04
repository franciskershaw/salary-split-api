import express from "express";
import asyncHandler from "express-async-handler";
import { authenticateToken } from "../../auth/middleware/auth.middleware";
import * as accountController from "../controllers/_account.controller";

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

export default router;
