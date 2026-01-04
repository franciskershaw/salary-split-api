import mongoose, { Document, Model } from "mongoose";

export interface ISavings extends Document {
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

const SavingsSchema = new mongoose.Schema(
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
SavingsSchema.index({ name: 1, createdBy: 1 }, { unique: true });

const Savings: Model<ISavings> = mongoose.model<ISavings>(
  "Savings",
  SavingsSchema
);
export default Savings;
