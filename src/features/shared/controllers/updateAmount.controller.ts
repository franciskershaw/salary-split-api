import { NextFunction, Request, Response } from "express";
import validateRequest from "../../../core/utils/validate";
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} from "../../../core/utils/errors";
import updateAmountSchema from "../validation/updateAmount.validation";
import { FEATURE_CONFIG, FeatureType } from "../../../core/utils/constants";
import Account from "../../accounts/model/account.model";
import Bill from "../../bills/model/bill.model";
import Expense from "../../expenses/model/expense.model";
import Savings from "../../savings/model/savings.model";
import { IUser } from "../../users/model/user.model";

// Model mapping with proper typing
const FEATURE_MODELS = {
  accounts: Account,
  bills: Bill,
  expenses: Expense,
  savings: Savings,
} as const;

// Common interface for all models
interface BaseModel {
  findById: (id: string) => Promise<any>;
  findByIdAndUpdate: (id: string, update: any, options?: any) => Promise<any>;
}

const updateAmount = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const value = validateRequest(req.body, updateAmountSchema);
    const { feature, itemId } = req.params;
    const user = req.user as IUser;
    const { amount } = value;

    // Validate feature parameter
    if (!feature || !(feature in FEATURE_CONFIG)) {
      throw new BadRequestError(
        `Invalid feature. Must be one of: ${Object.keys(FEATURE_CONFIG).join(
          ", "
        )}`
      );
    }

    const featureType = feature as FeatureType;
    const config = FEATURE_CONFIG[featureType];
    const Model = FEATURE_MODELS[featureType] as BaseModel;

    // Find the item
    const item = await Model.findById(itemId);

    if (!item) {
      throw new NotFoundError(`${config.singular} not found`);
    }

    if (item.createdBy.toString() !== user._id.toString()) {
      throw new ForbiddenError(
        `You are not authorized to update this ${config.singular}`
      );
    }

    // Update the item
    const updatedItem = await Model.findByIdAndUpdate(
      itemId,
      { amount },
      { new: true }
    );

    res.status(200).json({
      [config.responseKey]: updatedItem,
    });
  } catch (error) {
    next(error);
  }
};

export default updateAmount;
