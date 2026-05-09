import { Router } from "express";
import { authenticate } from "../middleware/auth.js";
import { exportShipments, exportRoutes, exportTrucks } from "../controllers/exportController.js";

const router = Router();

router.use(authenticate);

router.get("/shipments", exportShipments);
router.get("/routes", exportRoutes);
router.get("/trucks", exportTrucks);

export default router;
