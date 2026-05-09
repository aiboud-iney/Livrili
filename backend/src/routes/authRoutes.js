import express from "express";
const router = express.Router();
import validate from "../middleware/validate.js";
import userValidation from "../validations/userValidation.js";
import { signup, verifyEmail, resendVerification, login, changePassword, googleLogin } from "../controllers/authController.js";
import { authenticate } from "../middleware/auth.js";
import { forgotPassword, resetPassword } from "../controllers/forgotPasswordController.js";

router.post("/signup",              validate(userValidation), signup);
router.post("/verify-email",        verifyEmail);
router.post("/resend-verification", resendVerification);
router.post("/login",               login);
router.post("/forgot-password",     forgotPassword);
router.post("/reset-password",      resetPassword);
router.post("/google",              googleLogin);
router.post("/change-password",     authenticate, changePassword);

export default router;