import { Request, Response, NextFunction } from "express";
import Account, { IAccount } from "../../accounts/model/account.model";
import { IUser } from "../../users/model/user.model";
import { BadRequestError, NotFoundError } from "../../../core/utils/errors";

// Extend Express Request to include account
declare global {
  namespace Express {
    interface Request {
      account?: IAccount;
    }
  }
}

export const requireTransactionTracking = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user as IUser;
    const { accountId } = req.params;

    if (!accountId) {
      throw new BadRequestError("Account ID is required");
    }

    // Find account and verify ownership
    const account = await Account.findOne({
      _id: accountId,
      createdBy: user._id,
    });

    if (!account) {
      throw new NotFoundError("Account not found");
    }

    // Check if transaction tracking is enabled
    if (!account.trackTransactions) {
      throw new BadRequestError(
        "Transaction tracking is not enabled for this account. Please enable it in account settings."
      );
    }

    // Attach account to request for use in controllers
    req.account = account;

    next();
  } catch (error) {
    next(error);
  }
};
