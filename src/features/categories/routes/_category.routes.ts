import express from "express";
import asyncHandler from "express-async-handler";
import { authenticateToken } from "../../auth/middleware/auth.middleware";
import * as categoryController from "../controllers/_category.controller";

const router = express.Router();

router.get(
  "/",
  authenticateToken,
  asyncHandler(categoryController.getCategories)
);
router.post(
  "/",
  authenticateToken,
  asyncHandler(categoryController.addCategory)
);
router.put(
  "/:categoryId",
  authenticateToken,
  asyncHandler(categoryController.editCategory)
);
router.delete(
  "/:categoryId",
  authenticateToken,
  asyncHandler(categoryController.deleteCategory)
);

export default router;
