import express from "express";
import asyncHandler from "express-async-handler";
import {
  addTransaction,
  editTransaction,
  deleteTransaction,
  getTransactions,
} from "../controllers/transactionController";
import { isLoggedIn, isAuthorised } from "../middleware/authMiddleware";

const router = express.Router();

router
  .route("/")
  .get(isLoggedIn, asyncHandler(getTransactions))
  .post(isLoggedIn, asyncHandler(addTransaction));

router
  .route("/:transactionId")
  .put(isLoggedIn, isAuthorised, asyncHandler(editTransaction))
  .delete(isLoggedIn, isAuthorised, asyncHandler(deleteTransaction));

export default router;
