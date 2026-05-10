import { Router } from 'express';
import pool from '../config/db.js';

const router = Router();

router.get('/recent-activity', async (req, res) => {
  try {
    const result = await pool.query(`
      (SELECT 'shipment' as type, s.id, s.title as label, s.created_at, u.business_name as user
       FROM shipments s
       JOIN users u ON s.created_by = u.id
       ORDER BY s.created_at DESC
       LIMIT 5)
      UNION ALL
      (SELECT 'route' as type, r.id, r.origin || ' → ' || r.destination as label, r.created_at, u.business_name as user
       FROM routes r
       JOIN users u ON r.posted_by = u.id
       ORDER BY r.created_at DESC
       LIMIT 5)
      UNION ALL
      (SELECT 'truck' as type, t.id, t.brand || ' ' || t.model as label, t.created_at, u.business_name as user
       FROM trucks t
       JOIN users u ON t.created_by = u.id
       ORDER BY t.created_at DESC
       LIMIT 5)
      ORDER BY created_at DESC
      LIMIT 10
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching recent activity:', error);
    res.status(500).json({ message: 'Error fetching recent activity' });
  }
});

export default router;
