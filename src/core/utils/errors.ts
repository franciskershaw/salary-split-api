import { HTTPException } from "hono/http-exception";

export class BadRequestError extends HTTPException {
  constructor(message: string) {
    super(400, { message: message || "Bad Request" });
  }
}

export class UnauthorizedError extends HTTPException {
  errorCode?: string;

  constructor(message: string, errorCode?: string) {
    super(401, { message });
    this.errorCode = errorCode;
  }
}

export class ForbiddenError extends HTTPException {
  constructor(message: string) {
    super(403, { message: message || "Forbidden" });
  }
}

export class NotFoundError extends HTTPException {
  constructor(message: string) {
    super(404, { message: message || "Not Found" });
  }
}

export class ConflictError extends HTTPException {
  constructor(message: string) {
    super(409, { message: message || "Conflict" });
  }
}

export class TooManyRequestsError extends HTTPException {
  constructor(message: string) {
    super(429, { message: message || "Too Many Requests" });
  }
}

export class InternalServerError extends HTTPException {
  constructor(message: string) {
    super(500, { message: message || "Internal Server Error" });
  }
}
