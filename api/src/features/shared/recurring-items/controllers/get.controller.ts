import { Context } from "hono";
import { Model } from "mongoose";

export const createGetController = (ItemModel: Model<any>) => {
  return async (c: Context) => {
    const userId = c.get("user")._id;
    const items = await ItemModel.find({ createdBy: userId })
      .populate("account")
      .sort({ order: 1 });

    return c.json(items, 200);
  };
};
