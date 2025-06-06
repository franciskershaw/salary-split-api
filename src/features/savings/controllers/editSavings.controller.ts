import { Request, Response, NextFunction } from "express";
import Savings from "../model/savings.model";
import User from "../../users/model/user.model";
import validateRequest from "../../../core/utils/validate";
import savingsSchema from "../validation/savings.validation";
import { ConflictError } from "../../../core/utils/errors";
import { NotFoundError } from "../../../core/utils/errors";

const editSavings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const value = validateRequest(req.body, savingsSchema);
    const { savingsId } = req.params;

    const [user, existingSavings] = await Promise.all([
      User.findById(req.user),
      Savings.findById(savingsId),
    ]);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    if (!existingSavings) {
      throw new NotFoundError("Savings not found");
    }

    // Only check for name uniqueness if the name is being changed
    if (value.name !== existingSavings.name) {
      const nameExists = await Savings.findOne({
        createdBy: req.user,
        name: value.name,
        _id: { $ne: savingsId }, // Exclude current savings from check
      });

      if (nameExists) {
        throw new ConflictError("You've used that name already");
      }
    }

    const savings = await Savings.findByIdAndUpdate(savingsId, value, {
      new: true,
    });

    res.status(200).json(savings);
  } catch (error) {
    next(error);
  }
};

export default editSavings;
