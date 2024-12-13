// @ts-nocheck
import { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import {
  UnauthorizedError,
  NotFoundError,
  BadRequestError,
} from "../errors/errors";
import { verifyToken } from "../helper/helper";

import User from "../models/User";

const isLoggedIn = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    let token;
    try {
      if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
      ) {
        // Get token from header
        token = req.headers.authorization.split(" ")[1];
        // Verify token
        const decoded = verifyToken(token, process.env.ACCESS_TOKEN_SECRET);
        // Get user from token
        req.user = await User.findById(decoded._id).select("-password");
        next();
      }

      if (!token) {
        throw new UnauthorizedError("Please log in to proceed", "UNAUTHORIZED");
      }
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        throw new UnauthorizedError(
          "Session expired, please log in again",
          "SESSION_EXPIRED"
        );
      } else if (err.name === "JsonWebTokenError") {
        throw new UnauthorizedError(
          "Invalid token, please log in again",
          "INVALID_TOKEN"
        );
      } else {
        throw new UnauthorizedError(
          "An error occurred while trying to authenticate the token",
          "INVALID_TOKEN"
        );
      }
    }
  }
);

const isAuthorised = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const loggedInUserId = req.user._id;
    const { userId, accountId, transactionId } = req.params;

    try {
      if (!loggedInUserId) {
        throw NotFoundError("User not found");
      }

      if (userId) {
        if (loggedInUserId.equals(userId)) {
          next();
        } else {
          throw new UnauthorizedError(
            "You must be the owner of this account to continue",
            "UNAUTHORIZED"
          );
        }
      } else if (accountId) {
        const loggedInUserAccounts = req.user.accounts;
        const isAccountOwned = loggedInUserAccounts.some((account) =>
          account.equals(accountId)
        );

        if (isAccountOwned) {
          next();
        } else {
          throw new UnauthorizedError(
            "You must be the owner of this account to continue",
            "UNAUTHORIZED"
          );
        }
      } else if (transactionId) {
        const loggedInUserTransactions = req.user.transactions;
        const isTransactionOwned = loggedInUserTransactions.some(
          (transaction) => transaction.equals(transactionId)
        );

        if (isTransactionOwned) {
          next();
        } else {
          throw new UnauthorizedError(
            "You must be the owner of this account to continue",
            "UNAUTHORIZED"
          );
        }
      } else {
        throw new BadRequestError("Missing resource identifier in request");
      }
    } catch (err) {
      next(err);
    }
  }
);

export { isLoggedIn, isAuthorised };
