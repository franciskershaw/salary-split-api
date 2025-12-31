import { Context } from "hono";
import Account from "../model/account.model";

const getAccounts = async (c: Context) => {
  const userId = c.get("user")._id;
  const accounts = await Account.find({ createdBy: userId }).sort({ order: 1 });

  console.log(accounts);

  return c.json(accounts, 200);
};

export default getAccounts;
