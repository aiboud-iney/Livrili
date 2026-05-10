import { Router } from "express";
import { authenticate } from "../middleware/auth.js";
import {
  exportShipments,
  exportRoutes,
  exportTrucks,
  exportSubscriptions,
  exportAuditLogs,
  exportUsers,
} from "../controllers/exportController.js";

const router = Router();

router.use(authenticate);

router.get("/shipments",     exportShipments);
router.get("/routes",        exportRoutes);
router.get("/trucks",        exportTrucks);
router.get("/subscriptions", exportSubscriptions);
router.get("/audit-logs",    exportAuditLogs);
router.get("/users",         exportUsers);

export default router;
