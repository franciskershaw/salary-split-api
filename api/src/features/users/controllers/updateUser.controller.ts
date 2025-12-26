import { Context } from "hono";
import User from "../model/user.model";
import { UpdateUserInput } from "../validation/updateUser.user.validation";
import { NotFoundError } from "../../../core/utils/errors";

const updateUser = async (c: Context) => {
  const userId = c.get("user")?._id;

  if (!userId) {
    throw new NotFoundError("User not found");
  }

  const body = await c.req.json<UpdateUserInput>();

  const updatedUser = await User.findByIdAndUpdate(userId, body, { new: true });

  if (!updatedUser) {
    throw new NotFoundError("User not found");
  }

  return c.json(updatedUser, 200);
};

export default updateUser;
