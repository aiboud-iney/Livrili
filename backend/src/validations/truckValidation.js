import Joi from "joi";

export const createTruckSchema = Joi.object({
  name:          Joi.string().required(),
  truck_type:    Joi.string().required(),
  max_tonnage:   Joi.alternatives().try(
    Joi.number(),
    Joi.string().pattern(/^\d+(\.\d+)?$/)
  ).required(),
  max_volume:    Joi.alternatives().try(
    Joi.number(),
    Joi.string().pattern(/^\d+(\.\d+)?$/)
  ).required(),
  license_plate: Joi.string().required(),
});
