import express from "express";
import asyncHandler from "express-async-handler";
import { authenticateToken } from "../../auth/middleware/auth.middleware";
import * as userController from "../controllers/_user.controller";

const router = express.Router();

router.get("/", authenticateToken, asyncHandler(userController.getUser));

router.put("/", authenticateToken, asyncHandler(userController.updateUser));

router.patch(
  "/salary",
  authenticateToken,
  asyncHandler(userController.updateSalary)
);

router.put(
  "/account-filters",
  authenticateToken,
  asyncHandler(userController.updateFilters)
);

router.put(
  "/bill-filters",
  authenticateToken,
  asyncHandler(userController.updateFilters)
);

router.put(
  "/expense-filters",
  authenticateToken,
  asyncHandler(userController.updateFilters)
);

router.put(
  "/savings-filters",
  authenticateToken,
  asyncHandler(userController.updateFilters)
);

export default router;
