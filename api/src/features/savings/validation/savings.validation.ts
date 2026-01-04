import { z } from "zod";
import mongoose from "mongoose";

export const savingsSchema = z
  .object({
    name: z.string().min(1, "Please provide a savings name."),
    amount: z.number().min(0, "Amount cannot be negative."),
    dueDate: z
      .number()
      .int("Due date must be a whole number.")
      .min(1, "Due date must be at least 1.")
      .max(31, "Due date cannot be more than 31."),
    account: z
      .string()
      .min(1, "Please provide an account ID.")
      .refine((value) => mongoose.Types.ObjectId.isValid(value), {
        message: "Invalid account ID format",
      }),
  })
  .strict();

export type SavingsInput = z.infer<typeof savingsSchema>;
