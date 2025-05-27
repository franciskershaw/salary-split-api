import mongoose, { Document, Model } from "mongoose";

export interface IAccount extends Document {}

const AccountSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    acceptsFunds: {
      type: Boolean,
      required: true,
      default: true,
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
