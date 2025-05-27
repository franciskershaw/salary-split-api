import { Schema } from "joi";
import { BadRequestError } from "../utils/errors";

const validateRequest = <T>(payload: unknown, schema: Schema<T>): T => {
  if (payload === undefined || payload === null) {
    throw new BadRequestError("Request body is required");
  }

  const { value, error } = schema.validate(payload, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    const errorMessage = error.details
      .map((detail) => detail.message)
      .join(", ");
    throw new BadRequestError(errorMessage);
  }

  return value as T;
};

export default validateRequest;
