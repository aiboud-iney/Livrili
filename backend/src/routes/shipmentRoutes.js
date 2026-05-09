import express from "express";
const router = express.Router();
import {
  createShipment,
  getShipment,
  updateShipment,
  deleteShipment,
  getAllShipments,
  getAllMyShipments,
  getMyShipmentsCount,
  getOriginShipments,
  getDestinationShipments,
  sortByCreationDateAsc,
  sortByCreationDateDesc,
  updateShipmentStatus,
} from "../controllers/shipmentController.js";
import { authenticate } from "../middleware/auth.js";
import { uploadShipment } from "../middleware/upload.js";

router.post(
  "/",
  authenticate,
  uploadShipment.array("shipment_pictures", 5),
  createShipment,
);
router.get("/my-shipments", authenticate, getAllMyShipments);
router.get("/count", authenticate, getMyShipmentsCount);
router.get("/origin/:origin", getOriginShipments);
router.get("/destination/:destination", getDestinationShipments);
router.get("/sort/asc", sortByCreationDateAsc);
router.get("/sort/desc", sortByCreationDateDesc);
router.get("/:id", getShipment);
router.patch("/:id/status", authenticate, updateShipmentStatus);
router.put("/:id", authenticate, updateShipment);
router.delete("/:id", authenticate, deleteShipment);
router.get("/", getAllShipments);

export default router;
