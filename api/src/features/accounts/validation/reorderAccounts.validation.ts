import { z } from "zod";
import mongoose from "mongoose";

export const reorderAccountsSchema = z
  .array(
    z.string().refine((value) => mongoose.Types.ObjectId.isValid(value), {
      message: "Invalid account ID format",
    })
  )
  .min(1, "At least one account ID is required");

export type ReorderAccountsInput = z.infer<typeof reorderAccountsSchema>;
