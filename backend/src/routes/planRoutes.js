import express from "express";

import {
  createPlan,
  getAllPlans,
  getPlanById,
  updatePlan,
  deletePlan
} from "../controllers/plansController.js";

import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.post("/", authenticate, createPlan);

router.get("/", getAllPlans);
router.get("/getAllPlans", getAllPlans);

router.get("/:id", getPlanById);

router.put("/:id", authenticate, updatePlan);

router.delete("/:id", authenticate, deletePlan);

export default router;