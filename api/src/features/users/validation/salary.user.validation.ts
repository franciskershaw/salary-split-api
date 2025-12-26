import { z } from "zod";

export const updateSalarySchema = z.object({
  salary: z
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
});

export type UpdateSalaryInput = z.infer<typeof updateSalarySchema>;
