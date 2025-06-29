import Joi from "joi";

const updateAmountSchema = Joi.object({
  amount: Joi.number().required().messages({
    "number.base": "Amount must be a number.",
    "any.required": "Amount is required.",
  }),
});

export default updateAmountSchema;
