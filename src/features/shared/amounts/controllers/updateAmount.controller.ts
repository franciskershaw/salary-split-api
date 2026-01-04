import { Context } from "hono";
import Account from "../../../accounts/model/account.model";
import Bill from "../../../bills/model/bill.model";
import Expense from "../../../expenses/model/expense.model";
import Savings from "../../../savings/model/savings.model";
import { BadRequestError, NotFoundError } from "../../../../core/utils/errors";
import { FEATURE_CONFIG, FeatureType } from "../../../../core/utils/constants";

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

const updateAmount = async (c: Context) => {
  const userId = c.get("user")._id;
  const { feature, itemId } = c.req.param();
  const { amount } = await c.req.json();

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

  if (!item || item.createdBy.toString() !== userId.toString()) {
    throw new NotFoundError(`${config.singular} not found`);
  }

  // Update the item
  const updatedItem = await Model.findByIdAndUpdate(
    itemId,
    { amount },
    { new: true }
  );

  return c.json({ [config.responseKey]: updatedItem }, 200);
};

export default updateAmount;
