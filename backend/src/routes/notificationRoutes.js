import express from "express";
const router = express.Router();
import {
  getMyNotifications,
  getMyNotificationsCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteAllNotifications,
} from "../controllers/notificationController.js";
import { authenticate } from "../middleware/auth.js";

router.use(authenticate);
router.get("/", getMyNotifications);
router.get("/count", getMyNotificationsCount);
router.patch("/read-all", markAllNotificationsAsRead);
router.delete("/", deleteAllNotifications);
router.patch("/:id/read", markNotificationAsRead);
export default router;
