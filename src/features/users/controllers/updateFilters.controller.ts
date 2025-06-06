import { NextFunction, Request, Response } from "express";
import updateAccountFiltersSchema from "../validation/accountFilters.user.validation";
import updateBillFiltersSchema from "../validation/billFilters.user.validation";
import validateRequest from "../../../core/utils/validate";
import User from "../model/user.model";
import { BadRequestError, NotFoundError } from "../../../core/utils/errors";

// Map route paths to their corresponding schemas and field names
const FILTER_CONFIGS = {
  "account-filters": {
    schema: updateAccountFiltersSchema,
    field: "accountFilters",
  },
  "bill-filters": {
    schema: updateBillFiltersSchema,
    field: "billFilters",
  },
  "expense-filters": {
    schema: updateBillFiltersSchema,
    field: "expenseFilters",
  },
  "savings-filters": {
    schema: updateBillFiltersSchema,
    field: "savingsFilters",
  },
} as const;

// Add type for filter types
type FilterType = keyof typeof FILTER_CONFIGS;

const updateFilters = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const filterType = req.path.split("/").pop() as FilterType;

    if (!filterType || !(filterType in FILTER_CONFIGS)) {
      throw new BadRequestError(`Invalid filter type: ${filterType}`);
    }

    const { schema, field } = FILTER_CONFIGS[filterType];
    const filters = validateRequest(req.body, schema);

    const user = await User.findById(req.user);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { [field]: filters },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
};

export default updateFilters;
