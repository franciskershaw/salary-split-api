import Joi from "joi";
import { CATEGORY_APPLICABLE_FEATURES } from "../../../core/utils/constants";

const categorySchema = Joi.object({
  name: Joi.string().required().messages({
    "string.empty": "Please provide a category name.",
    "any.required": "Category name is required.",
  }),
  icon: Joi.string().required().messages({
    "string.empty": "Please provide an icon.",
    "any.required": "Icon is required.",
  }),
  color: Joi.string()
    .required()
    .pattern(/^#[0-9A-F]{6}$/i)
    .messages({
      "string.empty": "Please provide a color.",
      "string.pattern.base": "Color must be a valid hex code (e.g., #FF5733).",
      "any.required": "Color is required.",
    }),
  appliesTo: Joi.array()
    .items(Joi.string().valid(...CATEGORY_APPLICABLE_FEATURES))
    .min(1)
    .required()
    .messages({
      "array.base": "Applies to must be an array.",
      "array.min": "Category must apply to at least one feature type.",
      "any.required": "Applies to is required.",
      "any.only": `Feature type must be one of: ${CATEGORY_APPLICABLE_FEATURES.join(
        ", "
      )}.`,
    }),
});

export default categorySchema;
