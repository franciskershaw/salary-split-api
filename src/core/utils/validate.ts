import { zValidator } from "@hono/zod-validator";
import { ZodType } from "zod";

export const validate = (
  target: "json" | "query" | "param",
  schema: ZodType<any>
) => {
  return zValidator(target, schema, (result) => {
    if (!result.success) {
      throw result.error;
    }
  });
};
