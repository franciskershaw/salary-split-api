import { z } from "zod";
import { BILL_TYPES } from "../../../core/utils/constants";

const billTypeValues = Object.values(BILL_TYPES);

export const updateBillFiltersSchema = z.array(
  z
    .object({
      type: z.enum(billTypeValues),
      enabled: z.boolean(),
    })
    .strict()
);

export type UpdateBillFilterInput = z.infer<typeof updateBillFiltersSchema>;
