import mongoose, { Document, Model } from "mongoose";
import {
  AccountType,
  ACCOUNT_TYPES,
  BILL_TYPES,
} from "../../../core/utils/constants";

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  email: string;
  password?: string;
  name: {
    firstName: string;
    lastName: string;
  };
  role: "user" | "admin";
  provider: "google" | "local";
  googleId?: string;
  takeHomePay: number;
  payDay: string;
  defaultCurrency: "GBP" | "USD" | "EUR";
  defaultTheme: "light" | "dark";
  defaultAccount?: mongoose.Types.ObjectId;
  accountFilters?: {
    type: AccountType;
    enabled: boolean;
  }[];
  billFilters?: {
    bill: mongoose.Types.ObjectId;
    enabled: boolean;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
    password: {
      type: String,
      select: false,
    },
    name: {
      firstName: {
        type: String,
        required: [true, "Please provide a first name"],
      },
      lastName: {
        type: String,
      },
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    provider: {
      type: String,
      enum: ["google", "local"],
      required: true,
    },
    takeHomePay: {
      type: Number,
      default: 0,
    },
    payDay: {
      type: String,
    },
    defaultAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
    },
    defaultCurrency: {
      type: String,
      enum: ["GBP", "USD", "EUR"],
      default: "GBP",
    },
    defaultTheme: {
      type: String,
      enum: ["light", "dark"],
      default: "light",
    },
    accountFilters: [
      {
        type: {
          type: String,
          enum: Object.values(ACCOUNT_TYPES),
          required: true,
        },
        enabled: {
          type: Boolean,
          required: true,
          default: true,
        },
      },
    ],
    billFilters: [
      {
        type: {
          type: String,
          enum: Object.values(BILL_TYPES),
          required: true,
        },
        enabled: {
          type: Boolean,
          required: true,
          default: true,
        },
      },
    ],
    expenseFilters: [
      {
        type: {
          type: String,
          enum: Object.values(BILL_TYPES),
          required: true,
        },
        enabled: {
          type: Boolean,
          required: true,
          default: true,
        },
      },
    ],
    savingsFilters: [
      {
        type: {
          type: String,
          enum: Object.values(BILL_TYPES),
          required: true,
        },
        enabled: {
          type: Boolean,
          required: true,
          default: true,
        },
      },
    ],
  },
  { timestamps: true }
);

const User: Model<IUser> = mongoose.model<IUser>("User", UserSchema);
export default User;
