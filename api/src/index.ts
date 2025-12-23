import "dotenv/config";
import { serve } from "@hono/node-server";
import { createApp } from "./app";
import connectDb from "./core/config/database";

const PORT = Number(process.env.PORT) || 3000;

const start = async () => {
  try {
    // Connect to the database
    await connectDb();

    // create Hono app
    const app = createApp();

    // Start server
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
  } catch (err) {
    console.error(`Error: ${err instanceof Error ? err.message : err}`);
    process.exit(1);
  }
};

start();
