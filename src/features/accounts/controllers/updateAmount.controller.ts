import { NextFunction, Request, Response } from "express";
import validateRequest from "../../../core/utils/validate";
import Account from "../model/account.model";
import { ForbiddenError, NotFoundError } from "../../../core/utils/errors";
import updateAmountSchema from "../validation/updateAmount.validation";

const updateAmount = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const value = validateRequest(req.body, updateAmountSchema);
    const { accountId } = req.params;
    const { amount } = value;

    const account = await Account.findById(accountId);

    if (!account) {
      throw new NotFoundError("Account not found");
    }

    if (account.createdBy.toString() !== req.user!.toString()) {
      throw new ForbiddenError("You are not authorized to update this account");
    }

    const updatedAccount = await Account.findByIdAndUpdate(
      accountId,
      { amount },
      { new: true }
    );

    res.status(200).json({
      updatedAccount,
    });
  } catch (error) {
    next(error);
  }
};

export default updateAmount;
