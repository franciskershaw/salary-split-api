import { Context } from "hono";
import { updateAccountFiltersSchema } from "../validation/accountFilters.user.validation";
import { updateBillFiltersSchema } from "../validation/billFilters.user.validation";
import { BadRequestError, NotFoundError } from "../../../core/utils/errors";
import User from "../model/user.model";

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

const updateFilters = async (c: Context) => {
  const filterType = c.req.path.split("/").pop() as FilterType;

  if (!filterType || !(filterType in FILTER_CONFIGS)) {
    throw new BadRequestError(`Invalid filter type: ${filterType}`);
  }
  const { field } = FILTER_CONFIGS[filterType];

  const user = c.get("user");

  const body = await c.req.json();

  const updatedUser = await User.findByIdAndUpdate(
    user?._id,
    { [field]: body },
    { new: true }
  );

  if (!updatedUser) {
    throw new NotFoundError("User not found");
  }

  return c.json(updatedUser, 200);
};

export default updateFilters;
