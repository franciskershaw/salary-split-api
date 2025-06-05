import { Request, Response, NextFunction } from "express";
import Savings from "../model/savings.model";
import { IUser } from "../../users/model/user.model";

const getSavings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user as IUser;
    const savings = await Savings.find({ createdBy: user._id })
      .populate("account")
      .sort({
        order: 1,
      });
    res.status(200).json(savings);
  } catch (err) {
    next(err);
  }
};

export default getSavings;
