import { Context } from "hono";
import User from "../model/user.model";
import { NotFoundError } from "../../../core/utils/errors";

const updateSalary = async (c: Context) => {
  const userId = c.get("user")._id;

  console.log("userId", userId);

  const { salary } = await c.req.json();
  console.log("salary", salary);

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { takeHomePay: salary },
    { new: true }
  );

  if (!updatedUser) {
    throw new NotFoundError("User not found");
  }

  return c.json(updatedUser, 200);
};

export default updateSalary;
