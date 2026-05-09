import express from "express";
import {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserContactById,
  updateProfilePicture,
  getPendingVerifications,
  approveUserVerification,
  requestVerification
} from "../controllers/userController.js";
import validate from "../middleware/validate.js";
import createUserSchema from "../validations/userValidation.js";
import uploadProfile from "../middleware/profileUpload.js";
import { authenticate, authorizeUserOrAdmin, authorizeAdmin } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", validate(createUserSchema), createUser);

router.post("/approve/:id",  authenticate, authorizeAdmin, approveUserVerification);
router.get("/getAllUsers",    authenticate, authorizeAdmin, getAllUsers);
router.get("/pending",       authenticate, authorizeAdmin, getPendingVerifications);

router.get("/:id",           authenticate, authorizeUserOrAdmin, getUserById);
router.put("/:id",           authenticate, authorizeUserOrAdmin, uploadProfile.single("profile_picture"), updateUser);
router.put("/updatePfp/:id", authenticate, authorizeUserOrAdmin, uploadProfile.single("profile_picture"), updateProfilePicture);
router.delete("/:id",        authenticate, authorizeUserOrAdmin, deleteUser);
router.get("/:id/contact",   authenticate, getUserContactById);

router.post("/:id/request-verification", authenticate, authorizeUserOrAdmin, requestVerification);

export default router;
