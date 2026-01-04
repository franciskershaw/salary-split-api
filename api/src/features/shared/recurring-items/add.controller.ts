import { Context } from "hono";
import { Model } from "mongoose";
import Account from "../../accounts/model/account.model";
import User from "../../users/model/user.model";
import { ConflictError, NotFoundError } from "../../../core/utils/errors";

export const createAddController = (ItemModel: Model<any>) => {
  return async (c: Context) => {
    const userId = c.get("user")._id;
    const body = await c.req.json();

    const [user, existingItems, itemCount] = await Promise.all([
      User.findById(userId),
      ItemModel.find({ createdBy: userId, name: body.name }).countDocuments(),
      ItemModel.countDocuments({ createdBy: userId }),
    ]);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    if (existingItems > 0) {
      throw new ConflictError("You've used that name already");
    }

    const account = await Account.findOne({
      _id: body.account,
      createdBy: user._id,
    });

    if (!account) {
      throw new NotFoundError("Account not found");
    }

    const item = new ItemModel({
      ...body,
      order: itemCount,
      createdBy: user._id,
    });

    await item.save();

    return c.json(item, 201);
  };
};
