import { serve } from "@hono/node-server";
import { Hono } from "hono";
import dotenv from "dotenv";
dotenv.config();
import connectDb from "./core/config/databse";

const PORT = Number(process.env.PORT) || 3000;
const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello Hono!");
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
