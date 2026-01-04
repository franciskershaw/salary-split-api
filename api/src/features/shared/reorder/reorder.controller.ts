import { Context } from "hono";
import { Model } from "mongoose";
import { ForbiddenError } from "../../../core/utils/errors";

export const createReorderController = (ItemModel: Model<any>, itemName: string) => {
  return async (c: Context) => {
    const userId = c.get("user")._id;
    const itemIds = await c.req.json();

    // Verify all items belong to user
    const items = await ItemModel.find({
      _id: { $in: itemIds },
      createdBy: userId,
    });

    if (items.length !== itemIds.length) {
      throw new ForbiddenError(
        `Some ${itemName}s do not exist or you don't have access`
      );
    }

    // Update all items
    const updates = itemIds.map((itemId: string, index: number) => ({
      updateOne: {
        filter: { _id: itemId },
        update: { $set: { order: index } },
      },
    }));

    await ItemModel.bulkWrite(updates);

    const updatedItems = await ItemModel.find({ createdBy: userId }).sort({
      order: 1,
    });

    return c.json(updatedItems, 200);
  };
};
