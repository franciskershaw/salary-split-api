import mongoose, { Document, Model } from "mongoose";

export interface ITransaction extends Document {
  _id: mongoose.Types.ObjectId;
  account: mongoose.Types.ObjectId;
  amount: number;
  type: "income" | "expense" | "transfer";
  category: string;
  description: string;
  date: Date;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITransactionSplit {
  category: mongoose.Types.ObjectId;
  amount: number;
  description?: string;
}

export interface ITransaction extends Document {
  _id: mongoose.Types.ObjectId;
  account: mongoose.Types.ObjectId;
  type: "income" | "expense" | "transfer";
  splits: ITransactionSplit[];
  description: string;
  date: Date;
  transferToAccount?: mongoose.Types.ObjectId;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const TransactionSplitSchema = new mongoose.Schema(
  {
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      validate: {
        validator: function (value: number) {
          return value !== 0;
        },
        message: "Split amount cannot be zero",
      },
    },
    description: {
      type: String,
      trim: true,
    },
  },
  { _id: false }
);

const TransactionSchema = new mongoose.Schema(
  {
    account: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      required: true,
    },
    type: {
      type: String,
      enum: ["income", "expense", "transfer"],
      required: true,
    },
    splits: {
      type: [TransactionSplitSchema],
      required: true,
      validate: {
        validator: function (splits: ITransactionSplit[]) {
          return splits.length > 0;
        },
        message: "Transaction must have at least one split",
      },
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: Date,
      required: true,
    },
    transferToAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      required: function (this: ITransaction) {
        return this.type === "transfer";
      },
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// Indexes for efficient querying
TransactionSchema.index({ account: 1, date: -1 }); // Account transaction history
TransactionSchema.index({ account: 1, "splits.category": 1 }); // Category analysis
TransactionSchema.index({ createdBy: 1, date: -1 }); // User-wide queries
TransactionSchema.index({ createdBy: 1, account: 1, date: -1 }); // Most common query pattern
TransactionSchema.index({ date: 1 }); // Date range queries

// Virtual to calculate total transaction amount
TransactionSchema.virtual("totalAmount").get(function (this: ITransaction) {
  return this.splits.reduce((sum, split) => sum + split.amount, 0);
});

const Transaction: Model<ITransaction> = mongoose.model<ITransaction>(
  "Transaction",
  TransactionSchema
);
export default Transaction;
