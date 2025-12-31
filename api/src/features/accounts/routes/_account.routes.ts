import { Hono } from "hono";
import { authenticate } from "../../../core/middleware/auth.middleware";
import accountController from "../controllers/_account.controller";
import { validate } from "../../../core/utils/validate";
import { accountSchema } from "../validation/account.validation";
// import { reorderAccountsSchema } from "../validation/reorderAccounts.validation";

const accountRoutes = new Hono();

// accountRoutes.get("/", authenticate, accountController.getAccounts);

accountRoutes.post(
  "/",
  authenticate,
  validate("json", accountSchema),
  accountController.addAccount
);

// accountRoutes.put("/reorder", authenticate, validate("json", reorderAccountsSchema), accountController.reorderAccounts);

// accountRoutes.put("/:accountId", authenticate, validate("json", accountSchema), accountController.editAccount);

// accountRoutes.delete("/:accountId", authenticate, accountController.deleteAccount);

export default accountRoutes;
