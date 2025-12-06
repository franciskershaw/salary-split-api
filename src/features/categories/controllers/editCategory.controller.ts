import { Request, Response, NextFunction } from "express";
import Category from "../model/category.model";
import User from "../../users/model/user.model";
import validateRequest from "../../../core/utils/validate";
import categorySchema from "../validation/category.validation";
import { ConflictError, NotFoundError } from "../../../core/utils/errors";

const editCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const value = validateRequest(req.body, categorySchema);
    const { categoryId } = req.params;

    const [user, existingCategory] = await Promise.all([
      User.findById(req.user),
      Category.findById(categoryId),
    ]);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    if (!existingCategory) {
      throw new NotFoundError("Category not found");
    }

    // Verify ownership
    if (existingCategory.createdBy.toString() !== user._id.toString()) {
      throw new NotFoundError("Category not found");
    }

    // Only check for name uniqueness if the name is being changed
    if (value.name !== existingCategory.name) {
      const nameExists = await Category.findOne({
        createdBy: req.user,
        name: value.name,
        _id: { $ne: categoryId }, // Exclude current category from check
      });

      if (nameExists) {
        throw new ConflictError("You've used that name already");
      }
    }

    const category = await Category.findByIdAndUpdate(categoryId, value, {
      new: true,
    });

    res.status(200).json(category);
  } catch (error) {
    next(error);
  }
};

export default editCategory;
