import { Request, Response, NextFunction } from "express";
import Savings from "../model/savings.model";
import { ForbiddenError } from "../../../core/utils/errors";
import validateRequest from "../../../core/utils/validate";
import reorderSavingsSchema from "../validation/reorderSavings.validation";

const reorderSavings = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const savingsIds = validateRequest(req.body, reorderSavingsSchema);
    const userId = req.user;

    // Verify all accounts belong to user
    const savings = await Savings.find({
      _id: { $in: savingsIds },
      createdBy: userId,
    });

    if (savings.length !== savingsIds.length) {
      throw new ForbiddenError(
        "Some savings do not exist or you don't have access"
      );
    }

    // Update all accounts
    const updates = savingsIds.map((savingsId: string, index: number) => ({
      updateOne: {
        filter: { _id: savingsId },
        update: { $set: { order: index } },
      },
    }));

    await Savings.bulkWrite(updates);

    const updatedSavings = await Savings.find({ createdBy: userId }).sort({
      order: 1,
    });

    res.status(200).json(updatedSavings);
  } catch (error) {
    next(error);
  }
};

export default reorderSavings;
