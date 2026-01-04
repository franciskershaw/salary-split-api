import { z } from "zod";

export const updateAmountSchema = z
  .object({
    amount: z.number(),
  })
  .strict();

export type UpdateAmountInput = z.infer<typeof updateAmountSchema>;
