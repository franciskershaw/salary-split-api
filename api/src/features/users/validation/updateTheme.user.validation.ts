import { z } from "zod";

export const updateThemeSchema = z.object({
  defaultTheme: z.enum(["light", "dark"]),
});

export type UpdateThemeInput = z.infer<typeof updateThemeSchema>;
