import { z } from "zod";
import { ACCOUNT_TYPES, AccountType } from "../../../core/utils/constants";

const accountTypeValues = Object.values(ACCOUNT_TYPES) as [
  AccountType,
  ...AccountType[]
];

export const accountSchema = z.object({
  name: z.string().min(1, "Please provide an account name."),
  amount: z.number().default(0),
  acceptsFunds: z.boolean().default(true),
  receivesSalary: z.boolean().default(false),
  type: z.enum(accountTypeValues).default("current"),
  isDefault: z.boolean().default(false),
  institution: z.string().optional(),
  targetMonthlyAmount: z
    .object({
      amount: z.number(),
      splitBetween: z
        .number()
        .min(1, "Split between must be at least 1 person.")
        .max(10, "Split between cannot exceed 10 people."),
    })
    .optional()
    .nullable(),
});

export type AccountInput = z.infer<typeof accountSchema>;
