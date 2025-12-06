import mongoose, { Document, Model } from "mongoose";
import { AccountType, ACCOUNT_TYPES } from "../../../core/utils/constants";

export interface IAccount extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  institution?: string;
  amount: number;
  acceptsFunds: boolean;
  receivesSalary?: boolean;
  type: AccountType;
  targetMonthlyAmount?: {
    amount: number;
    splitBetween: number;
  };
  trackTransactions?: boolean;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
}

const AccountSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    institution: {
      type: String,
    },
    amount: {
      type: Number,
      required: true,
      default: 0,
    },
    acceptsFunds: {
      type: Boolean,
      required: true,
      default: true,
    },
    receivesSalary: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      enum: Object.values(ACCOUNT_TYPES),
      required: true,
      default: ACCOUNT_TYPES.CURRENT,
    },
    targetMonthlyAmount: {
      type: {
        amount: {
          type: Number,
          required: true,
        },
        splitBetween: {
          type: Number,
          required: true,
          min: 1,
          max: 10,
        },
      },
      required: false,
    },
    order: {
      type: Number,
      required: true,
    },
    trackTransactions: {
      type: {
        balance: {
          type: Number,
          required: true,
        },
        timestamp: {
          type: Date,
          required: true,
        },
      },
      required: false,
      default: null,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// Compound unique index: name must be unique per user
AccountSchema.index({ name: 1, createdBy: 1 }, { unique: true });

const Account: Model<IAccount> = mongoose.model<IAccount>(
  "Account",
  AccountSchema
);
export default Account;
