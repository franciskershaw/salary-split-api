import express from "express";
import asyncHandler from "express-async-handler";
import { authenticateToken } from "../../auth/middleware/auth.middleware";
import updateAmount from "../controllers/updateAmount.controller";

const router = express.Router();

router.patch(
  "/:feature/:itemId",
  authenticateToken,
  asyncHandler(updateAmount)
);

export default router;
