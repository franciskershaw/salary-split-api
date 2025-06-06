import { Request, Response, NextFunction } from "express";
import Bill from "../model/bill.model";
import { ForbiddenError } from "../../../core/utils/errors";
import validateRequest from "../../../core/utils/validate";
import reorderBillsSchema from "../validation/reorderBills.validation";

const reorderBills = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const billIds = validateRequest(req.body, reorderBillsSchema);
    const userId = req.user;

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

    // Update all accounts
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

    res.status(200).json(updatedBills);
  } catch (error) {
    next(error);
  }
};

export default reorderBills;
