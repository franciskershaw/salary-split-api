import mongoose, { Document, Model } from "mongoose";

export interface IBill extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  amount: number;
  dueDate: number;
  account: mongoose.Types.ObjectId;
  splitBetween?: number;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const BillSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
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
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Bill: Model<IBill> = mongoose.model<IBill>("Bill", BillSchema);
export default Bill;
