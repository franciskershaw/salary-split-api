import { Hono } from "hono";
import { logger } from "hono/logger";
import { cors } from "hono/cors";
import { securityHeaders } from "./core/middleware/security.middleware";
import { errorHandler } from "./core/middleware/error.middleware";
import authRoutes from "./features/auth/routes/_auth.routes";

const isNetworkDevelopmentMode =
  process.env.NODE_ENV === "development" && process.argv.includes("--host");

export const createApp = () => {
  const app = new Hono();

  // Logger middleware
  app.use(logger());

  // Security headers middleware
  app.use(securityHeaders);

  // CORS middleware

  app.use(
    cors({
      origin: isNetworkDevelopmentMode
        ? process.env.CORS_ORIGIN_NETWORK || "http://localhost:5173"
        : process.env.CORS_ORIGIN || "http://localhost:5173",
      credentials: true,
      allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowHeaders: ["Content-Type", "Authorization"],
    })
  );

  // Feature routes
  app.route("/api/auth", authRoutes);

  // Welcome / Health check route
  app.get("/", (c) =>
    c.json({ message: "Welcome to the Salary Split API (Hono Edition)" }, 200)
  );

  // Error handling middleware
  app.onError(errorHandler);

  return app;
};
