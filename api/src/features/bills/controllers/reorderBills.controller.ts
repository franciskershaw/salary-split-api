import { Context } from "hono";
import Bill from "../model/bill.model";
import { ForbiddenError } from "../../../core/utils/errors";

const reorderBills = async (c: Context) => {
  const userId = c.get("user")._id;
  const billIds = await c.req.json();

  // Verify all accounts belong to user
  const bills = await Bill.find({
    _id: { $in: billIds },
    createdBy: userId,
  });

  if (bills.length !== billIds.length) {
    throw new ForbiddenError(
      "Some bills do not exist or you don't have access"
    );
  }

  // Update all bills
  const updates = billIds.map((billId: string, index: number) => ({
    updateOne: {
      filter: { _id: billId },
      update: { $set: { order: index } },
    },
  }));

  await Bill.bulkWrite(updates);

  const updatedBills = await Bill.find({ createdBy: userId }).sort({
    order: 1,
  });

  return c.json(updatedBills, 200);
};

export default reorderBills;
