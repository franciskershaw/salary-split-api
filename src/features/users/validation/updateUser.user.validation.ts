import { z } from "zod";
import { CURRENCIES } from "../../../core/utils/constants";

const currencyValues = Object.values(CURRENCIES) as [string, ...string[]];

export const updateUserSchema = z
  .object({
    name: z.object({
      firstName: z.string().min(1, "First name is required."),
      lastName: z.string().min(1, "Last name is required."),
    }),
    takeHomePay: z
      .number()
      .min(0, "Salary cannot be negative.")
      .max(1000000, "Salary cannot exceed 1,000,000.")
      .refine(
        (val) => {
          const decimalPart = val.toString().split(".")[1];
          return !decimalPart || decimalPart.length <= 2;
        },
        { error: "Salary can only have up to 2 decimal places." }
      ),
    defaultCurrency: z.enum(currencyValues),
  })
  .strict();

export type UpdateUserInput = z.infer<typeof updateUserSchema>;
