import express from "express";
import asyncHandler from "express-async-handler";

import {
  getAccounts,
  addAccount,
  editAccount,
  deleteAccount,
} from "../controllers/accountController";

import { isLoggedIn, isAuthorised } from "../middleware/authMiddleware";

const router = express.Router();

router
  .route("/")
  .get(isLoggedIn, asyncHandler(getAccounts))
  .post(isLoggedIn, asyncHandler(addAccount));

router
  .route("/:accountId")
  .put(isLoggedIn, isAuthorised, asyncHandler(editAccount))
  .delete(isLoggedIn, isAuthorised, asyncHandler(deleteAccount));

export default router;
