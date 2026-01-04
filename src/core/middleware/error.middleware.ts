// src/core/middleware/error.middleware.ts
import { ErrorHandler } from "hono";
import { HTTPException } from "hono/http-exception";
import { UnauthorizedError } from "../utils/errors";
import dayjs from "dayjs";
import { ZodError } from "zod";

export const errorHandler: ErrorHandler = (err, c) => {
  // Log in development
  if (process.env.NODE_ENV === "development") {
    console.log(dayjs().format("MMM D YYYY, h:mm:ss a"), err);
  }

  // Handle Zod validation errors
  if (err instanceof ZodError) {
    const errors = err.issues.map((issue) => {
      let message = issue.message;

      // Check for "required field" errors using error code
      if (issue.code === "invalid_type" && issue.expected === "string") {
        // Get the field name from the path
        const fieldName = issue.path[issue.path.length - 1];
        message = `${String(fieldName)} is required.`;
      }

      return {
        field: issue.path.join("."),
        message: message,
      };
    });

    return c.json({ message: "Validation error", errors }, 400);
  }

  // UnauthorizedError (only one that needs errorCode)
  if (err instanceof UnauthorizedError) {
    return c.json(
      {
        message: err.message,
        errorCode: err.errorCode, // Frontend needs this
      },
      401
    );
  }

  // Handle all HTTPException errors (including your custom errors)
  if (err instanceof HTTPException) {
    return c.json(
      {
        message: err.message,
      },
      err.status
    );
  }

  // Default 500 for unexpected errors
  const message = "An unexpected error occurred, please try again later.";
  return c.json(
    {
      message,
      stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
    },
    500
  );
};
