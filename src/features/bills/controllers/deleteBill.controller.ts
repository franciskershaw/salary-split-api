import { NextFunction, Request, Response } from "express";
import Bill from "../model/bill.model";
import { NotFoundError } from "../../../core/utils/errors";
import User from "../../users/model/user.model";

const deleteBill = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user;
    const user = await User.findById(userId);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    const { billId } = req.params;
    const bill = await Bill.findById(billId);
    if (!bill || bill.createdBy.toString() !== user._id.toString()) {
      throw new NotFoundError("Bill not found");
    }

    await Bill.findByIdAndDelete(billId);

    res.status(200).json({ message: "Bill deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export default deleteBill;
