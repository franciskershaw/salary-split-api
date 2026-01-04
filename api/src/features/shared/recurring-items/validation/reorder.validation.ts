import { z } from "zod";
import mongoose from "mongoose";

export const reorderRecurringItemsSchema = z
  .array(
    z.string().refine((value) => mongoose.Types.ObjectId.isValid(value), {
      message: "Invalid item ID format",
    })
  )
  .min(1, "At least one item ID is required");

export type ReorderRecurringItemsInput = z.infer<
  typeof reorderRecurringItemsSchema
>;
