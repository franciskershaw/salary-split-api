import joi from "joi";
import mongoose from "mongoose";

const reorderAccountsSchema = joi
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
    "array.base": "Account IDs must be an array",
    "array.min": "At least one account ID is required",
    "any.required": "Account IDs are required",
    "any.invalid": "Invalid account ID format",
  });

export default reorderAccountsSchema;
