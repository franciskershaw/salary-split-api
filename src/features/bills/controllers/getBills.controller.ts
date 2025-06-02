import { Request, Response, NextFunction } from "express";
import Bill from "../model/bill.model";
import { IUser } from "../../users/model/user.model";

const getBills = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user as IUser;
    const bills = await Bill.find({ createdBy: user._id }).sort({
      order: 1,
    });
    res.status(200).json(bills);
  } catch (err) {
    next(err);
  }
};

export default getBills;
