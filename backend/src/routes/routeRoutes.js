import express from "express";
const router = express.Router();
import {
  createRoute,
  getRoute,
  assignShipment,
  cancelAssignment,
  deleteRoute,
  updateRoute,
  updateRouteStatus,
  getAllRoutes,
  getAllMyRoutes,
  getMyRoutesCount,
  getRouteShipments,
  updateRouteShipmentLocations,
  markShipmentPickedUp,
} from "../controllers/routeController.js";
import validate from "../middleware/validate.js";
import routeValidation, {
  getAllRoutesQuerySchema,
} from "../validations/routeValidation.js";
import routeLocationSchema from "../validations/routeLocationValidation.js";
import assignValidation from "../validations/assignmentValidation.js";
import { authenticate } from "../middleware/auth.js";

const validateGetAllRoutesQuery = (req, res, next) => {
  const { error } = getAllRoutesQuerySchema.validate(req.query);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

router.post("/", authenticate, createRoute);
router.get("/my-routes", authenticate, getAllMyRoutes);
router.get("/count", authenticate, getMyRoutesCount);
router.patch(
  "/:id/location",
  authenticate,
  validate(routeLocationSchema),
  updateRouteShipmentLocations,
);
router.patch("/:id/shipments/:shipmentId/pickup", authenticate, markShipmentPickedUp);
router.get("/:id/shipments", authenticate, getRouteShipments);

router.get("/:id", getRoute);

router.post("/:id/assign", authenticate, validate(assignValidation), assignShipment);
router.patch("/:id/status", authenticate, updateRouteStatus);
router.delete("/:id/assignments/:assignmentId", authenticate, cancelAssignment);
router.delete("/:id", authenticate, deleteRoute);
router.put("/:id", authenticate, updateRoute);

router.get("/", getAllRoutes);

export default router;
