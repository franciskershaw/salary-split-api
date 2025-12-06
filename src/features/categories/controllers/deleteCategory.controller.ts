import { NextFunction, Request, Response } from "express";
import Category from "../model/category.model";
import { NotFoundError } from "../../../core/utils/errors";
import User from "../../users/model/user.model";

const deleteCategory = async (
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

    const { categoryId } = req.params;
    const category = await Category.findById(categoryId);
    if (!category || category.createdBy.toString() !== user._id.toString()) {
      throw new NotFoundError("Category not found");
    }

    await Category.findByIdAndDelete(categoryId);

    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export default deleteCategory;
