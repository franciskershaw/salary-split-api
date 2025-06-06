import joi from "joi";
import mongoose from "mongoose";

const reorderExpensesSchema = joi
  .array()
  .items(
    joi.string().custom((value, helpers) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.error("any.invalid");
      }
      return value;
    }, "ObjectId validation")
  )
  .min(1)
  .required()
  .messages({
    "array.base": "Expense IDs must be an array",
    "array.min": "At least one expense ID is required",
    "any.required": "Expense IDs are required",
    "any.invalid": "Invalid expense ID format",
  });

export default reorderExpensesSchema;
