import express from "express";
import {
  createSubscription,
  getAllSubscriptions,
  getSubscriptionById,
  getSubscriptionsByUserId,
  updateSubscription,
  deleteSubscription,
  activateSubscription,
  getSubscriptionStats,
  getPendingSubscriptions,
  getUserSubscription,
  getPaymentHistory,
  upgradeSubscription,
  renewSubscription,
  choosePlan
} from "../controllers/userSubsController.js";
import receiptUpload from "../middleware/receiptUpload.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.get("/getAllSubscriptions", authenticate, getAllSubscriptions);
router.get("/stats",              authenticate, getSubscriptionStats);
router.get("/pending",            authenticate, getPendingSubscriptions);
router.get("/user/:userId",       authenticate, getSubscriptionsByUserId);
router.get("/me",                 authenticate, getUserSubscription);

router.get("/payments/:userId",   authenticate, getPaymentHistory);

router.post("/choose",             authenticate, choosePlan);
router.post("/upgrade",            authenticate, upgradeSubscription);
router.post("/renew",              authenticate, renewSubscription);

router.put("/activate/:id",       authenticate, activateSubscription);

router.post("/",       authenticate, receiptUpload.single("receipt"), createSubscription);
router.get("/:id",     authenticate, getSubscriptionById);
router.put("/:id",     authenticate, updateSubscription);
router.delete("/:id",  authenticate, deleteSubscription);

export default router;