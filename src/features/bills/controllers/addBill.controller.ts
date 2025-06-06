import { Request, Response, NextFunction } from "express";
import Account from "../../accounts/model/account.model";
import Bill from "../model/bill.model";
import User from "../../users/model/user.model";
import validateRequest from "../../../core/utils/validate";
import billSchema from "../validation/bill.validation";
import { ConflictError, NotFoundError } from "../../../core/utils/errors";

const addBill = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const value = validateRequest(req.body, billSchema);

    const [user, existingBills, billCount] = await Promise.all([
      User.findById(req.user),
      Bill.find({ createdBy: req.user, name: value.name }).countDocuments(),
      Bill.countDocuments({ createdBy: req.user }),
    ]);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    if (existingBills > 0) {
      throw new ConflictError("You've used that name already");
    }

    const account = await Account.findOne({
      _id: value.account,
      createdBy: user._id,
    });

    if (!account) {
      throw new NotFoundError("Account not found");
    }

    const bill = new Bill({
      ...value,
      order: billCount,
      createdBy: user._id,
    });

    await bill.save();

    res.status(201).json(bill);
  } catch (error) {
    next(error);
  }
};

export default addBill;
