import Bill from "../model/bill.model";
import { createAddController } from "../../shared/recurring-items/add.controller";
import { createEditController } from "../../shared/recurring-items/edit.controller";
import { createDeleteController } from "../../shared/recurring-items/delete.controller";
import { createGetController } from "../../shared/recurring-items/get.controller";
import { createReorderController } from "../../shared/reorder/reorder.controller";

export default {
  addBill: createAddController(Bill),
  getBills: createGetController(Bill),
  editBill: createEditController(Bill),
  deleteBill: createDeleteController(Bill),
  reorderBills: createReorderController(Bill, "bill"),
};
