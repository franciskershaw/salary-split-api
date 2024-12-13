import mongoose from "mongoose";

export interface ITransaction {
  name: string;
  user: mongoose.Schema.Types.ObjectId;
  amount: number;
  type: "bill" | "savings";
  sendToAccount: mongoose.Schema.Types.ObjectId;
}

const TransactionSchema = new mongoose.Schema({
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
  sendToAccount: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Account",
    required: true,
  },
  type: {
    type: String,
    enum: ["bill", "savings"],
    required: true,
  },
});

const Transaction = mongoose.model<ITransaction>(
  "Transaction",
  TransactionSchema
);

export default Transaction;
