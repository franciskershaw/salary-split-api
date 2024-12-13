import mongoose from "mongoose";

export interface IUser {
  username: string;
  name: string;
  password: string;
  monthlySalary: number;
  transactions: mongoose.Schema.Types.ObjectId[];
  accounts: mongoose.Schema.Types.ObjectId[];
  defaultAccount: mongoose.Schema.Types.ObjectId;
}

const UserSchema = new mongoose.Schema<IUser>({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  monthlySalary: {
    type: Number,
    required: true,
    default: 0,
  },
  transactions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Transaction",
    },
  ],
  accounts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
    },
  ],
  defaultAccount: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Account",
  },
});

const User = mongoose.model<IUser>("User", UserSchema);

export default User;
