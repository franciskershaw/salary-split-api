import { NextFunction, Request, Response } from "express";
import Savings from "../model/savings.model";
import { NotFoundError } from "../../../core/utils/errors";
import User from "../../users/model/user.model";

const deleteSavings = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user;
    const user = await User.findById(userId);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    const { savingsId } = req.params;
    const savings = await Savings.findById(savingsId);
    if (!savings || savings.createdBy.toString() !== user._id.toString()) {
      throw new NotFoundError("Savings not found");
    }

    await Savings.findByIdAndDelete(savingsId);

    res.status(200).json({ message: "Savings deleted successfully" });
  } catch (error) {
    next(error);
  }
};

  export default deleteSavings;
