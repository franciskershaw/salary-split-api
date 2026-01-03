import { Context } from "hono";
import Bill from "../model/bill.model";
import User from "../../users/model/user.model";
import { NotFoundError } from "../../../core/utils/errors";

const deleteBill = async (c: Context) => {
  const user = await User.findById(c.get("user")._id);

  if (!user) {
    throw new NotFoundError("User not found");
  }

  const billId = c.req.param("billId");
  const bill = await Bill.findById(billId);

  if (!bill || bill.createdBy.toString() !== user._id.toString()) {
    throw new NotFoundError("Bill not found");
  }

  await Bill.findByIdAndDelete(billId);

  return c.json({ message: "Bill deleted successfully" }, 200);
};

export default deleteBill;
