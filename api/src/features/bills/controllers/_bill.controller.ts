import Bill from "../model/bill.model";
import { createAddController } from "../../shared/recurring-items/controllers/add.controller";
import { createEditController } from "../../shared/recurring-items/controllers/edit.controller";
import { createDeleteController } from "../../shared/recurring-items/controllers/delete.controller";
import { createGetController } from "../../shared/recurring-items/controllers/get.controller";
import { createReorderController } from "../../shared/reorder/reorder.controller";

export default {
  addBill: createAddController(Bill),
  getBills: createGetController(Bill),
  editBill: createEditController(Bill, "billId"),
  deleteBill: createDeleteController(Bill, "billId"),
  reorderBills: createReorderController(Bill, "bill"),
};
