import express from "express";
import asyncHandler from "express-async-handler";
import { authenticateToken } from "../../auth/middleware/auth.middleware";
import * as billController from "../controllers/_bill.controller";

const router = express.Router();

router.get("/", authenticateToken, asyncHandler(billController.getBills));
router.post("/", authenticateToken, asyncHandler(billController.addBill));
router.put(
  "/reorder",
  authenticateToken,
  asyncHandler(billController.reorderBills)
);
router.put(
  "/:billId",
  authenticateToken,
  asyncHandler(billController.editBill)
);
router.delete(
  "/:billId",
  authenticateToken,
  asyncHandler(billController.deleteBill)
);

export default router;
