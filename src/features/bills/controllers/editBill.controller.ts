import { Request, Response, NextFunction } from "express";
import Bill from "../model/bill.model";
import User from "../../users/model/user.model";
import validateRequest from "../../../core/utils/validate";
import billSchema from "../validation/bill.validation";
import { ConflictError } from "../../../core/utils/errors";
import { NotFoundError } from "../../../core/utils/errors";

const editBill = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const value = validateRequest(req.body, billSchema);
    const { billId } = req.params;

    const [user, existingBill] = await Promise.all([
      User.findById(req.user),
      Bill.findById(billId),
    ]);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    if (!existingBill) {
      throw new NotFoundError("Bill not found");
    }

    // Only check for name uniqueness if the name is being changed
    if (value.name !== existingBill.name) {
      const nameExists = await Bill.findOne({
        createdBy: req.user,
        name: value.name,
        _id: { $ne: billId }, // Exclude current bill from check
      });

      if (nameExists) {
        throw new ConflictError("You've used that name already");
      }
    }

    const bill = await Bill.findByIdAndUpdate(billId, value, { new: true });

    res.status(200).json(bill);
  } catch (error) {
    next(error);
  }
};

export default editBill;
