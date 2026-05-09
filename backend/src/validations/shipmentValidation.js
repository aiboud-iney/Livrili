import Joi from "joi";

const createShipmentSchema = Joi.object({
  title: Joi.string().optional(),
  origin: Joi.string().required(),
  destination: Joi.string().required(),
  current_lat: Joi.number().optional(),
  current_lng: Joi.number().optional(),
  from_pickup_date: Joi.date().iso().required(),
  to_pickup_date: Joi.date().iso().required(),
  weight: Joi.number().optional(),
  volume: Joi.number().optional(),
  phone_number: Joi.string().min(6).required(),
  description: Joi.string().optional().allow(""),
})
  .or("weight", "volume");

export default createShipmentSchema;
