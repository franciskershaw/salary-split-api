import { z } from "zod";
import { ACCOUNT_TYPES } from "../../../core/utils/constants";

const accountTypeValues = Object.values(ACCOUNT_TYPES);

export const updateAccountFiltersSchema = z.array(
  z.object({
    type: z.enum(accountTypeValues),
    enabled: z.boolean(),
  })
);

// Export type for TypeScript
export type UpdateAccountFiltersInput = z.infer<
  typeof updateAccountFiltersSchema
>;
