import { Context } from "hono";
import User from "../model/user.model";
import { NotFoundError } from "../../../core/utils/errors";
import { sendTokensAndUser } from "../../auth/utils/auth.helper";

const getUserInfo = async (c: Context) => {
  const userId = c.get("user")?._id;

  if (!userId) {
    throw new NotFoundError("User not found");
  }

  const user = await User.findById(userId).lean();

  if (!user) {
    throw new NotFoundError("User not found");
  }

  return sendTokensAndUser(c, user, 200);
};

export default getUserInfo;
