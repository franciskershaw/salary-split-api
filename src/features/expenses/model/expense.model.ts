import mongoose, { Document, Model } from "mongoose";
import { BILL_TYPES } from "../../../core/utils/constants";

export interface IExpense extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  amount: number;
  dueDate: number;
  account: mongoose.Types.ObjectId;
  order?: number;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ExpenseSchema = new mongoose.Schema(
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
    type: {
      type: String,
      enum: Object.values(BILL_TYPES),
      required: true,
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

const Expense: Model<IExpense> = mongoose.model<IExpense>(
  "Expense",
  ExpenseSchema
);
export default Expense;
