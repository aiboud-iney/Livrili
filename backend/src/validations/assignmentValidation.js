import Joi from "joi";

const assignSchema = Joi.object({
  shipment_id: Joi.number().integer().required(),
});

export default assignSchema;
