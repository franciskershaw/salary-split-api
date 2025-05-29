import { Schema } from "joi";
import { BadRequestError } from "../utils/errors";

const validateRequest = <T>(payload: unknown, schema: Schema<T>): T => {
  if (payload === undefined || payload === null) {
    throw new BadRequestError("Request body is required");
  }

  const { value, error } = schema.validate(payload);

  if (error) {
    throw new BadRequestError(error.details[0].message);
  }

  return value as T;
};

export default validateRequest;
