import addAccount from "./addAccount.controller";
import getAccounts from "./getAccounts.controller";
import editAccount from "./editAccount.controller";
import deleteAccount from "./deleteAccount.controller";
import Account from "../model/account.model";
import { createReorderController } from "../../shared/reorder/reorder.controller";

export default {
  getAccounts,
  addAccount,
  reorderAccounts: createReorderController(Account, "account"),
  editAccount,
  deleteAccount,
};
