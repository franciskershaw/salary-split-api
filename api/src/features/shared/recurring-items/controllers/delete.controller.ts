import { Context } from "hono";
import { Model } from "mongoose";
import User from "../../../users/model/user.model";
import { NotFoundError } from "../../../../core/utils/errors";

export const createDeleteController = (ItemModel: Model<any>) => {
  return async (c: Context) => {
    const user = await User.findById(c.get("user")._id);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    const itemId = c.req.param("billId") || c.req.param("expenseId") || c.req.param("savingId");
    const item = await ItemModel.findById(itemId);

    if (!item || item.createdBy.toString() !== user._id.toString()) {
      throw new NotFoundError("Item not found");
    }

    await ItemModel.findByIdAndDelete(itemId);

    return c.json({ message: "Item deleted successfully" }, 200);
  };
};
