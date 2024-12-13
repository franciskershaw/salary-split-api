import express from "express";
import dotenv from "dotenv";
dotenv.config();
import connectDb from "./config/db";
import "colors";
import { errorHandler } from "./middleware/errorMiddleware";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRoutes from "./routes/userRoutes";
import accountRoutes from "./routes/accountRoutes";
import transactionRoutes from "./routes/transactionRoutes";

// Grab port info from config
const PORT = process.env.PORT || 5300;

// Initialize app
const app = express();

// Body parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// Cors
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

// Routes
app.use("/api/users", userRoutes);
app.use("/api/accounts", accountRoutes);
app.use("/api/transactions", transactionRoutes);

// Error handler
app.use(errorHandler);

app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to the Salary Split API" });
});

// Connect to DB, then if successful listen for app
connectDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(
        `Server running in ${process.env.NODE_ENV} mode on port ${PORT}\n`
          .yellow,
        "-----------------------------------------------------------".yellow
      );
    });
  })
  .catch((err) => {
    console.error(
      `Error connecting to MongoDB: ${err.message}`.red.underline.bold
    );
    process.exit(1);
  });
