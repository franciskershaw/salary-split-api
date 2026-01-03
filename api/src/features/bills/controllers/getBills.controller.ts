import { Context } from "hono";
import Bill from "../model/bill.model";

const getBills = async (c: Context) => {
  const userId = c.get("user")._id;
  const bills = await Bill.find({ createdBy: userId })
    .populate("account")
    .sort({ order: 1 });

  return c.json(bills, 200);
};

export default getBills;
