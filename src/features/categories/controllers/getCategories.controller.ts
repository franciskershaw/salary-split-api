import { Request, Response, NextFunction } from "express";
import Category from "../model/category.model";
import { IUser } from "../../users/model/user.model";

const getCategories = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user as IUser;
    const categories = await Category.find({ createdBy: user._id }).sort({
      name: 1,
    });
    res.status(200).json(categories);
  } catch (err) {
    next(err);
  }
};

export default getCategories;
