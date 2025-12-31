import mongoose, { Document, Model } from "mongoose";
import { BILL_TYPES } from "../../../core/utils/constants";

export interface IBill extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  amount: number;
  dueDate: number;
  account: mongoose.Types.ObjectId;
  splitBetween?: number;
  order?: number;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const BillSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    dueDate: {
      type: Number,
      required: true,
      min: 1,
      max: 31,
      validate: {
        validator: Number.isInteger,
        message: "Due date must be a whole number.",
      },
    },
    account: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
    },
    type: {
      type: String,
      enum: Object.values(BILL_TYPES),
      required: true,
    },
    splitBetween: {
      type: Number,
      default: 1,
      min: 1,
      max: 10,
      validate: {
        validator: Number.isInteger,
        message: "Split between must be a whole number.",
      },
    },
    order: {
      type: Number,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

// Compound unique index: name must be unique per user
BillSchema.index({ name: 1, createdBy: 1 }, { unique: true });

const Bill: Model<IBill> = mongoose.model<IBill>("Bill", BillSchema);
export default Bill;
