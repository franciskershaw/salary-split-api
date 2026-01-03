import { z } from "zod";
import mongoose from "mongoose";

export const reorderBillsSchema = z
  .array(
    z.string().refine((value) => mongoose.Types.ObjectId.isValid(value), {
      message: "Invalid bill ID format",
    })
  )
  .min(1, "At least one bill ID is required");

export type ReorderBillsInput = z.infer<typeof reorderBillsSchema>;
