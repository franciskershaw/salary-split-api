import mongoose, { Document, Model } from "mongoose";

export interface IAccount extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  institution?: string;
  amount: number;
  acceptsFunds: boolean;
  receivesSalary?: boolean;
  type: "current" | "savings" | "investment" | "joint";
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
}

const AccountSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
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
      enum: ["current", "savings", "investment", "joint"],
      required: true,
      default: "current",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Account: Model<IAccount> = mongoose.model<IAccount>(
  "Account",
  AccountSchema
);
export default Account;
