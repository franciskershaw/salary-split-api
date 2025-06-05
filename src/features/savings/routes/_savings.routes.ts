import express from "express";
import asyncHandler from "express-async-handler";
import { authenticateToken } from "../../auth/middleware/auth.middleware";
import * as savingsController from "../controllers/_savings.controller";

const router = express.Router();

router.get("/", authenticateToken, asyncHandler(savingsController.getSavings));
router.post("/", authenticateToken, asyncHandler(savingsController.addSavings));
router.put(
  "/reorder",
  authenticateToken,
  asyncHandler(savingsController.reorderSavings)
);
router.put(
  "/:savingsId",
  authenticateToken,
  asyncHandler(savingsController.editSavings)
);
router.delete(
  "/:savingsId",
  authenticateToken,
  asyncHandler(savingsController.deleteSavings)
);

export default router;
