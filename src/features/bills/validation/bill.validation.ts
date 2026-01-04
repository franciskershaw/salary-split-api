import { z } from "zod";
import { BILL_TYPES, BillType } from "../../../core/utils/constants";
import mongoose from "mongoose";

const billTypeValues = Object.values(BILL_TYPES) as [BillType, ...BillType[]];

export const billSchema = z
  .object({
    name: z.string().min(1, "Please provide a bill name."),
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
    type: z.enum(billTypeValues),
    splitBetween: z
      .number()
      .int("Split between must be a whole number.")
      .min(1, "Split between must be at least 1.")
      .max(10, "Split between cannot be more than 10.")
      .default(1),
  })
  .strict();

export type BillInput = z.infer<typeof billSchema>;
