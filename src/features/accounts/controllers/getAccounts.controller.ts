import { Request, Response, NextFunction } from "express";
import Account from "../model/account.model";
import { IUser } from "../../users/model/user.model";

const getAccounts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user as IUser;
    const accounts = await Account.find({ createdBy: user._id });
    res.status(200).json(accounts);
  } catch (err) {
    next(err);
  }
};

export default getAccounts;
