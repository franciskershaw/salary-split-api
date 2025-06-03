import Joi from "joi";
import { BILL_TYPES } from "../../../core/utils/constants";

const expenseSchema = Joi.object({
  name: Joi.string().required().messages({
    "string.empty": "Please provide a bill name.",
    "any.required": "Bill name is required.",
  }),
  amount: Joi.number().required().messages({
    "number.base": "Amount must be a number.",
    "any.required": "Amount is required.",
  }),
  dueDate: Joi.number().integer().min(1).max(31).required().messages({
    "number.base": "Due date must be a number.",
    "number.integer": "Due date must be a whole number.",
    "number.min": "Due date must be at least 1.",
    "number.max": "Due date cannot be more than 31.",
    "any.required": "Due date is required.",
  }),
  account: Joi.string().required().messages({
    "string.empty": "Please provide an account ID.",
    "any.required": "Account ID is required.",
  }),
  type: Joi.string()
    .valid(...Object.values(BILL_TYPES))
    .required()
    .messages({
      "string.empty": "Please provide a bill type.",
      "any.required": "Bill type is required.",
    }),
});

export default expenseSchema;
