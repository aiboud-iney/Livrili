import express from "express";
const router = express.Router();
import validate from "../middleware/validate.js";
import { createTruckSchema } from "../validations/truckValidation.js";
import {
  getAllTrucks,
  getTruckById,
  createTruck,
  updateTruck,
  deleteTruck,
  getMyTrucksCount,
} from "../controllers/truckController.js";
import { authenticate } from "../middleware/auth.js";
import { uploadTruck } from "../middleware/upload.js";

router.use(authenticate);
router.get("/", getAllTrucks);
router.get("/my-trucks", getAllTrucks);
router.get("/count", getMyTrucksCount);
router.post(
  "/",
  uploadTruck.array("truck_pictures", 5),
  validate(createTruckSchema),
  createTruck,
);
router.get("/:id", getTruckById);
router.put("/:id", updateTruck);
router.delete("/:id", deleteTruck);

export default router;
