import express from "express";
import asyncHandler from "express-async-handler";
import { authenticateToken } from "../../auth/middleware/auth.middleware";
import * as billController from "../controllers/_bill.controller";

const router = express.Router();

router.get("/", authenticateToken, asyncHandler(billController.getBills));
router.post("/", authenticateToken, asyncHandler(billController.addBill));

export default router;
