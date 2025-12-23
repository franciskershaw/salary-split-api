import { z } from "zod";

export const localRegisterSchema = z.object({
  email: z.email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(30, "Password too long"),
  name: z.object({
    firstName: z.string().min(1, "First name required"),
    lastName: z.string().optional(),
  }),
});

export type LocalRegisterInput = z.infer<typeof localRegisterSchema>;
