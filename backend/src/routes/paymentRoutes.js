import express from "express";
import { submitPayment } from "../controllers/paymentController.js";
import receiptUpload from "../middleware/receiptUpload.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

const handleMulterError = (err, req, res, next) => {
  if (err) {
    console.error('Multer error:', err);
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: "File too large. Maximum size is 3MB." });
    }
    if (err.message && err.message.includes('file type')) {
      return res.status(400).json({ message: err.message });
    }
    return res.status(400).json({ message: err.message || "File upload error" });
  }
  next();
};

router.post("/submit", authenticate, receiptUpload.single("receipt"), handleMulterError, submitPayment);

export default router;
