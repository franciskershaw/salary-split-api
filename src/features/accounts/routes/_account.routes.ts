import express from "express";
import asyncHandler from "express-async-handler";
import { authenticateToken } from "../../auth/middleware/auth.middleware";
import * as accountController from "../controllers/_account.controller";

const router = express.Router();

router.get("/", authenticateToken, asyncHandler(accountController.getAccounts));

export default router;
