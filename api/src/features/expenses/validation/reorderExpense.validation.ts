import { z } from "zod";
import mongoose from "mongoose";

export const reorderExpensesSchema = z
  .array(
    z.string().refine((value) => mongoose.Types.ObjectId.isValid(value), {
      message: "Invalid expense ID format",
    })
  )
  .min(1, "At least one expense ID is required");

export type ReorderExpensesInput = z.infer<typeof reorderExpensesSchema>;
