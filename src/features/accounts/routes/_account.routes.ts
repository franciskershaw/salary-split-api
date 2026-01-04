import { Hono } from "hono";
import { authenticate } from "../../../core/middleware/auth.middleware";
import validateObjectId from "../../../core/middleware/validateObjectId.middleware";
import accountController from "../controllers/_account.controller";
import { validate } from "../../../core/utils/validate";
import { accountSchema } from "../validation/account.validation";
import { reorderRecurringItemsSchema } from "../../shared/recurring-items/validation/reorder.validation";

const accountRoutes = new Hono();

accountRoutes.get("/", authenticate, accountController.getAccounts);

accountRoutes.post(
  "/",
  authenticate,
  validate("json", accountSchema),
  accountController.addAccount
);

accountRoutes.put(
  "/reorder",
  authenticate,
  validate("json", reorderRecurringItemsSchema),
  accountController.reorderAccounts
);

accountRoutes.put(
  "/:accountId",
  authenticate,
  validateObjectId("accountId"),
  validate("json", accountSchema),
  accountController.editAccount
);

accountRoutes.delete(
  "/:accountId",
  authenticate,
  validateObjectId("accountId"),
  accountController.deleteAccount
);

export default accountRoutes;
