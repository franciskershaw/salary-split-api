import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { logger } from "hono/logger";
import { cors } from "hono/cors";
import dotenv from "dotenv";
dotenv.config();
import connectDb from "./core/config/databse";
import { securityHeaders } from "./core/middleware/security.middleware";

const isNetworkDevelopmentMode =
  process.env.NODE_ENV === "development" && process.argv.includes("--host");

const PORT = Number(process.env.PORT) || 3000;
const app = new Hono();

app.use(logger());

app.use(securityHeaders);

app.use(
  cors({
    origin: isNetworkDevelopmentMode
      ? (process.env.CORS_ORIGIN_NETWORK as string)
      : (process.env.CORS_ORIGIN as string),
    credentials: true,
  })
);

app.get("/", (c) => {
  return c.json(
    { messge: "Welcome to the Salary Split API (Hono Edition)" },
    200
  );
});

// Start everything
connectDb()
  .then((db) => {
    console.log(
      "-------------------------------------------------------------"
    );
    console.log(`MongoDB connected: ${db.connection.host}`);

    serve({ fetch: app.fetch, port: PORT }, (info) => {
      console.log(
        `Server running in ${
          process.env.NODE_ENV || "development"
        } mode on port ${info.port}`
      );
      console.log(
        "-------------------------------------------------------------"
      );
    });
  })
  .catch((err) => {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  });
