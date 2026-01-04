import { Context, Next } from "hono";
import mongoose from "mongoose";
import { BadRequestError } from "../utils/errors";

export const validateObjectId = (paramName: string) => {
  return async (c: Context, next: Next) => {
    const id = c.req.param(paramName);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestError(`Invalid ${paramName} ID format`);
    }

    await next();
  };
};

export default validateObjectId;
