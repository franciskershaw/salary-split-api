import { z } from "zod";

export const localLoginSchema = z
  .object({
    email: z.email("Invalid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(30, "Password too long"),
  })
  .strict();

export type LocalLoginInput = z.infer<typeof localLoginSchema>;
