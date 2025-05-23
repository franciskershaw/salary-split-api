import { Request, Response, NextFunction } from "express";
import validateRequest from "../../../core/utils/validate";
import { localRegisterSchema } from "../validation/localRegister.auth.validation";
import { ConflictError, InternalServerError } from "../../../core/utils/errors";
import bcrypt from "bcryptjs";
import User from "../../users/model/user.model";
import { sendTokensAndUser } from "../utils/auth.helper";

const localRegister = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const value = validateRequest(req.body, localRegisterSchema);

    const { email, password, name } = value;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new ConflictError("User already exists");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      email,
      name,
      password: hashedPassword,
      provider: "local",
    });

    if (user) {
      sendTokensAndUser(res, user, 201);
    } else {
      throw new InternalServerError("Error creating user");
    }
  } catch (err) {
    next(err);
  }
};

export default localRegister;
