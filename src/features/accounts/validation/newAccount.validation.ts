import Joi from "joi";

const newAccountSchema = Joi.object({
  name: Joi.string().required().messages({
    "string.empty": "Please provide an account name.",
    "any.required": "Account name is required.",
  }),
  amount: Joi.number().default(0).messages({
    "number.base": "Amount must be a number.",
  }),
  acceptsFunds: Joi.boolean().default(true).messages({
    "boolean.base": "Accepts funds must be true or false.",
  }),
  receivesSalary: Joi.boolean().default(false).messages({
    "boolean.base": "Receives salary must be true or false.",
  }),
  type: Joi.string()
    .valid("current", "savings", "investment", "joint")
    .default("current")
    .messages({
      "string.base": "Account type must be a string.",
      "any.only":
        "Account type must be one of: current, savings, investment, or joint.",
    }),
  institution: Joi.string().allow("").messages({
    "string.base": "Institution must be a string.",
  }),
});

export default newAccountSchema;
