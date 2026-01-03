import { Hono } from "hono";
import { authenticate } from "../../../core/middleware/auth.middleware";
// import validateObjectId from "../../../core/middleware/validateObjectId.middleware";
import billController from "../controllers/_bill.controller";
import { validate } from "../../../core/utils/validate";
import { billSchema } from "../validation/bill.validation";
// import { reorderBillsSchema } from "../validation/reorderBills.validation";

const billRoutes = new Hono();

billRoutes.get("/", authenticate, billController.getBills);

billRoutes.post(
  "/",
  authenticate,
  validate("json", billSchema),
  billController.addBill
);

// billRoutes.put(
//   "/reorder",
//   authenticate,
//   validate("json", reorderBillsSchema),
//   billController.reorderBills
// );

// billRoutes.put(
//   "/:billId",
//   authenticate,
//   validateObjectId("billId"),
//   validate("json", billSchema),
//   billController.editBill
// );

// billRoutes.delete(
//   "/:billId",
//   authenticate,
//   validateObjectId("billId"),
//   billController.deleteBill
// );

export default billRoutes;
