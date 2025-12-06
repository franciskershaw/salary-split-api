import { Request, Response, NextFunction } from "express";
import Category from "../model/category.model";
import User from "../../users/model/user.model";
import validateRequest from "../../../core/utils/validate";
import categorySchema from "../validation/category.validation";
import { ConflictError, NotFoundError } from "../../../core/utils/errors";

const addCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const value = validateRequest(req.body, categorySchema);

    const [user, existingCategories] = await Promise.all([
      User.findById(req.user),
      Category.find({ createdBy: req.user, name: value.name }).countDocuments(),
    ]);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    if (existingCategories > 0) {
      throw new ConflictError("You've used that name already");
    }

    const category = new Category({
      ...value,
      createdBy: user._id,
    });

    await category.save();

    res.status(201).json(category);
  } catch (error) {
    next(error);
  }
};

export default addCategory;
