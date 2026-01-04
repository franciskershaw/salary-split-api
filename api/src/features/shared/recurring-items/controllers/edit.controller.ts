import { Context } from "hono";
import { Model } from "mongoose";
import User from "../../../users/model/user.model";
import { ConflictError, NotFoundError } from "../../../../core/utils/errors";

export const createEditController = (ItemModel: Model<any>) => {
  return async (c: Context) => {
    const userId = c.get("user")._id;
    const itemId = c.req.param("billId") || c.req.param("expenseId") || c.req.param("savingId");
    const body = await c.req.json();

    const [user, existingItem] = await Promise.all([
      User.findById(userId),
      ItemModel.findById(itemId),
    ]);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    if (!existingItem) {
      throw new NotFoundError("Item not found");
    }

    // Only check for name uniqueness if the name is being changed
    if (body.name !== existingItem.name) {
      const nameExists = await ItemModel.findOne({
        createdBy: userId,
        name: body.name,
        _id: { $ne: itemId },
      });

      if (nameExists) {
        throw new ConflictError("You've used that name already");
      }
    }

    const item = await ItemModel.findByIdAndUpdate(itemId, body, {
      new: true,
    });

    return c.json(item, 200);
  };
};
