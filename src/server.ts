import express from "express";
import dotenv from "dotenv";
dotenv.config();
import morgan from "morgan";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import cors from "cors";
import "colors";
import passport from "./core/config/passport";
import authRoutes from "./features/auth/routes/_auth.routes";
import userRoutes from "./features/users/routes/_user.routes";
import accountRoutes from "./features/accounts/routes/_account.routes";
import billRoutes from "./features/bills/routes/_bill.routes";
import expenseRoutes from "./features/expenses/routes/_expense.routes";
import savingsRoutes from "./features/savings/routes/_savings.routes";
import categoryRoutes from "./features/categories/routes/_category.routes";
import updateAmountRoutes from "./features/shared/routes/updateAmount.routes";
import connectDb from "./core/config/database";
import { errorHandler } from "./core/middleware/error.middleware";

const isNetworkDevelopmentMode =
  process.env.NODE_ENV === "development" && process.argv.includes("--host");

// Declare port to run server on
const PORT = process.env.PORT || 5300;

// Initialise app
const app = express();

// Logger
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

// Parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Cookies
app.use(cookieParser());

// Basic security
app.use(helmet());

// Cors
app.use(
  cors({
    origin: isNetworkDevelopmentMode
      ? process.env.CORS_ORIGIN_NETWORK
      : process.env.CORS_ORIGIN,
    credentials: true,
  })
);

// // Passport / Auth
app.use(passport.initialize());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/accounts", accountRoutes);
app.use("/api/bills", billRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/savings", savingsRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/update-amount", updateAmountRoutes);

app.get("/", (_, res) => {
  res.status(200).json({ message: "Welcome to the Salary Split API" });
});

// Error handler
app.use(errorHandler);

// Connect to DB and start the server
connectDb()
  .then(() => {
    // For network development mode only, bind to all interfaces
    if (isNetworkDevelopmentMode) {
      app.listen(parseInt(PORT as string, 10), "0.0.0.0", () => {
        console.log(
          `Server running in ${process.env.NODE_ENV} mode on network (0.0.0.0:${PORT})\n`
            .yellow,
          "-----------------------------------------------------------".yellow
        );
      });
    } else {
      // Normal mode
      app.listen(PORT, () => {
        console.log(
          `Server running in ${process.env.NODE_ENV} mode on port ${PORT}\n`
            .yellow,
          "-----------------------------------------------------------".yellow
        );
      });
    }
  })
  .catch((err) => {
    console.error(
      `Error connecting to MongoDB: ${err.message}`.red.underline.bold
    );
    process.exit(1);
  });
