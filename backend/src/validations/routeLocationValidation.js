import Joi from "joi";

const routeLocationSchema = Joi.object({
  current_lat: Joi.number().required(),
  current_lng: Joi.number().required(),
});

export default routeLocationSchema;
