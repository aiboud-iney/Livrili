import Joi from "joi";
import { createTruckSchema } from "../validations/truckValidation.js";

const wilayaQuerySchema = Joi.string()
  .trim()
  .custom((value, helpers) => {
    const match = value.match(/^(\d{2})\s*-\s*.+$/);
    if (!match) {
      return helpers.error("any.invalid");
    }

    const code = parseInt(match[1], 10);
    if (code < 1 || code > 69) {
      return helpers.error("any.invalid");
    }

    return value;
  }, "wilaya query validation")
  .messages({
    "any.invalid":
      "must follow the format 'NN - Wilaya Name' with a wilaya code between 01 and 69",
  });

const dateRangeQuerySchema = Joi.string()
  .trim()
  .custom((value, helpers) => {
    const match = value.match(
      /^(\d{2})\s*\/\s*(\d{2})\s*\/\s*(\d{4})\s+to\s+(\d{2})\s*\/\s*(\d{2})\s*\/\s*(\d{4})$/i,
    );

    if (!match) {
      return helpers.error("any.invalid");
    }

    const start = new Date(
      Date.UTC(Number(match[3]), Number(match[2]) - 1, Number(match[1])),
    );
    const end = new Date(
      Date.UTC(Number(match[6]), Number(match[5]) - 1, Number(match[4])),
    );

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      return helpers.error("any.invalid");
    }

    if (start > end) {
      return helpers.error("date.range");
    }

    return value;
  }, "date range validation")
  .messages({
    "any.invalid": "must be formatted as 'DD / MM / YYYY to DD / MM / YYYY'",
    "date.range": "start date must be before or equal to end date",
  });

const createRouteSchema = Joi.object({
  origin: Joi.string().required(),
  destination: Joi.string().required(),
  transit_cities: Joi.array().items(Joi.string()).optional(),
  departure_date: Joi.date().iso().required(),
  max_weight: Joi.number().required(),
  max_volume: Joi.number().optional(),
  phonecountrycode: Joi.string()
    .pattern(/^\+[1-9][0-9]{0,2}$/)
    .required(),
  contact_phone: Joi.string()
    .pattern(/^[0-9+\-()\s]{6,20}$/)
    .required(),
  notes: Joi.string().max(1000).allow("").optional(),
  truck_type: Joi.string().optional(),
  assigned_truck_id: Joi.number().integer().optional(),
});

export const getAllRoutesQuerySchema = Joi.object({
  origin: wilayaQuerySchema.optional(),
  destination: wilayaQuerySchema.optional(),
  dateRange: dateRangeQuerySchema.optional(),
  start_date: Joi.date().iso().optional(),
  end_date: Joi.date().iso().optional(),
  weightMin: Joi.number().integer().optional(),
  weightMax: Joi.number().integer().optional(),
  volumeMin: Joi.number().integer().optional(),
  volumeMax: Joi.number().integer().optional(),
  sortBy: Joi.string()
    .valid(
      "Newest",
      "Oldest",
      "Weight \u2191",
      "Weight \u2193",
      "Volume \u2191",
      "Volume \u2193",
    )
    .optional(),
  page: Joi.number().integer().min(1).required(),
  limit: Joi.number().integer().min(1).required(),
})
  .custom((value, helpers) => {
    if (
      value.weightMin !== undefined &&
      value.weightMax !== undefined &&
      value.weightMin > value.weightMax
    ) {
      return helpers.error("weight.range");
    }

    if (
      value.volumeMin !== undefined &&
      value.volumeMax !== undefined &&
      value.volumeMin > value.volumeMax
    ) {
      return helpers.error("volume.range");
    }

    return value;
  }, "range validation")
  .messages({
    "weight.range": "weightMin must be less than or equal to weightMax",
    "volume.range": "volumeMin must be less than or equal to volumeMax",
  });

export default createRouteSchema;
