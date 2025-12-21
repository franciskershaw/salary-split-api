import { ErrorHandler } from "hono";
import { UnauthorizedError } from "../utils/errors";
import dayjs from "dayjs";

export const errorHandler: ErrorHandler = (err, c) => {
  // Log in development
  if (process.env.NODE_ENV === "development") {
    console.log(dayjs().format("MMM D YYYY, h:mm:ss a"));
  }

  const statusCode = (err as any).statusCode || 500;
  let message = err.message;

  // Customise 500 errors
  if (statusCode === 500) {
    message = "An unexpected error occurred, please try again later.";
  }

  // Special handling for UnauthorizedError
  if (err instanceof UnauthorizedError) {
    return c.json(
      {
        message,
        errorCode: "UNAUTHORIZED",
      },
      statusCode
    );
  }

  // Default error response
  return c.json(
    {
      message,
      stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
    },
    statusCode
  );
};
