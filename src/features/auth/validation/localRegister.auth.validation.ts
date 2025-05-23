import Joi from "joi";

export const localRegisterSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Please provide a valid email address.",
    "any.required": "Email is required.",
  }),
  password: Joi.string().min(6).max(30).required().messages({
    "string.min": "Password must be at least 6 characters long.",
    "string.max": "Password must be at most 30 characters long.",
    "any.required": "Password is required.",
  }),
  name: Joi.object({
    firstName: Joi.string().trim().required().messages({
      "string.empty": "Please provide a first name.",
      "any.required": "First name is required.",
    }),
    lastName: Joi.string().trim().allow(""),
  })
    .required()
    .messages({
      "object.base": "Name must be an object with firstName and lastName.",
      "any.required": "Name is required.",
    }),
});
