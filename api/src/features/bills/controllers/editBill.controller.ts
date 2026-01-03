import { Context } from "hono";
import Bill from "../model/bill.model";
import User from "../../users/model/user.model";
import { ConflictError, NotFoundError } from "../../../core/utils/errors";

const edidtBill = async (c: Context) => {
  const userId = c.get("user")._id;
  const billId = c.req.param("billId");
  const body = await c.req.json();

  const [user, existingBill] = await Promise.all([
    User.findById(userId),
    Bill.findById(billId),
  ]);

  if (!user) {
    throw new NotFoundError("User not found");
  }

  if (!existingBill) {
    throw new NotFoundError("Bill not found");
  }

  // Only check for name uniqueness if the name is being changed
  if (body.name !== existingBill.name) {
    const nameExists = await Bill.findOne({
      createdBy: userId,
      name: body.name,
      _id: { $ne: billId }, // Exclude current bill from check
    });

    if (nameExists) {
      throw new ConflictError("You've used that name already");
    }
  }

  const bill = await Bill.findByIdAndUpdate(billId, body, { new: true });

  return c.json(bill, 200);
};

export default edidtBill;
