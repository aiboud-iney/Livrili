import Joi from "joi";

const signupSchema = Joi.object({
  email:          Joi.string().email().required(),
  password:       Joi.string()
                    .min(8)
                    .pattern(/[A-Z]/, "uppercase letter")
                    .pattern(/[0-9]/, "number")
                    .pattern(/[!@#$%^&*]/, "special character")
                    .required()
                    .messages({
                      "string.min":     "Password must be at least 8 characters.",
                      "string.pattern.name": "Password must contain at least one {#name}.",
                    }),
  business_name:  Joi.string().required(),
  phone_number:   Joi.string().required(),
  tin_nif:        Joi.string().required(),
  trade_register: Joi.string().required(),
  user_type:      Joi.string().valid("user", "admin").optional(),
  more_details:   Joi.string().optional().allow(""),
});

export default signupSchema;