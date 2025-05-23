import express from "express";
import asyncHandler from "express-async-handler";
import { authenticateToken } from "../../auth/middleware/auth.middleware";
import * as userController from "../controllers/_user.controller";

const router = express.Router();

router.get("/", authenticateToken, asyncHandler(userController.getUser));

export default router;
