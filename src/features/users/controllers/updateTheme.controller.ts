import { Context } from "hono";
import User from "../model/user.model";
import { NotFoundError } from "../../../core/utils/errors";

const updateTheme = async (c: Context) => {
  const userId = c.get("user")._id;

  const { defaultTheme } = await c.req.json();

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { defaultTheme },
    { new: true }
  );

  if (!updatedUser) {
    throw new NotFoundError("User not found");
  }

  return c.json(updatedUser, 200);
};

export default updateTheme;
