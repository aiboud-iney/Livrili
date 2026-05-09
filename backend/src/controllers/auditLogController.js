import pool from '../config/db.js';

const ACTION_TO_DECISION = {
  'VERIFIED': 'VERIFIED',
  'DELETED': 'DELETED',
  'BLOCKED_POST': 'BLOCKED POST',
};

export const getAuditLogs = async (req, res) => {
  try {
    const page  = Math.max(1, parseInt(req.query.page)  || 1);
    const limit = Math.min(100, parseInt(req.query.limit) || 50);
    const offset = (page - 1) * limit;

    const [logsResult, countResult] = await Promise.all([
      pool.query(
        `SELECT
           al.id,
           al.action,
           al.entity,
           al.entity_id,
           al.details,
           al.created_at,
           u.business_name AS admin_name,
           u.email         AS admin_email
         FROM audit_logs al
         LEFT JOIN users u ON al.user_id = u.id
         ORDER BY al.created_at DESC
         LIMIT $1 OFFSET $2`,
        [limit, offset]
      ),
      pool.query('SELECT COUNT(*)::int AS total FROM audit_logs'),
    ]);

    const logs = logsResult.rows.map((row) => {
      const decision = ACTION_TO_DECISION[row.action] || row.action;
      const details  = row.details || {};
      return {
        id:          String(row.id),
        auditNum:    `#${String(row.id).padStart(4, '0')}`,
        adminName:   row.admin_name || row.admin_email || 'System',
        userAccount: details.userAccount || details.targetEmail || '-',
        timestamp:   new Date(row.created_at).toLocaleString('en-US', {
          month: 'short', day: 'numeric', year: 'numeric',
          hour: '2-digit', minute: '2-digit',
        }),
        decision,
        details: details.note
          ? `${details.note}`
          : (Object.keys(details).length
              ? Object.entries(details)
                  .filter(([k]) => !['userAccount', 'targetEmail'].includes(k))
                  .map(([k, v]) => `${k}: ${v}`)
                  .join(' | ')
              : undefined),
      };
    });

    res.status(200).json({ logs, total: countResult.rows[0].total, page, limit });
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    res.status(500).json({ message: 'Error fetching audit logs' });
  }
};

export const createAuditLog = async (userId, action, entity, entityId, details = {}) => {
  try {
    await pool.query(
      `INSERT INTO audit_logs (user_id, action, entity, entity_id, details)
       VALUES ($1, $2, $3, $4, $5)`,
      [userId, action, entity, entityId, details]
    );
  } catch (err) {
    console.error('Audit log insert failed:', err.message);
  }
};
