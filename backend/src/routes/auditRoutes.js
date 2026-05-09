import express from 'express';
import { getAuditLogs } from '../controllers/auditLogController.js';
import { authenticate, authorizeAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticate, authorizeAdmin, getAuditLogs);

export default router;
