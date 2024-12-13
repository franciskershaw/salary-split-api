import mongoose from "mongoose";

export interface IAccount {
  name: string;
  user: mongoose.Schema.Types.ObjectId;
  amount: number;
  acceptsFunds: boolean;
  excludeFromTotal: boolean;
}

const AccountSchema = new mongoose.Schema<IAccount>({
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
  excludeFromTotal: {
    type: Boolean,
    required: true,
    default: false,
  },
});

const Account = mongoose.model<IAccount>("Account", AccountSchema);

export default Account;
