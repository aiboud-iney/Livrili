import pool from '../config/db.js';
import path from 'path';
import fs from 'fs';

const submitPayment = async (req, res) => {
  const {
    user_id,
    plan_id,
    payment_method,
    billing_cycle,
    amount
  } = req.body;

  if (!req.file) {
    return res.status(400).json({ message: "Payment receipt is required" });
  }

  const receiptPath = req.file.path;
  const filename = req.file.filename;
  const resolvedUserId = user_id || req.user?.id;

  try {

    const existing = await pool.query(
      "SELECT id FROM user_subscriptions WHERE user_id = $1 AND status IN ('pending','active') LIMIT 1",
      [resolvedUserId]
    );
    if (existing.rows.length > 0) {
      fs.unlink(req.file.path, () => {});
      return res.status(409).json({ message: "You already have a pending or active subscription" });
    }

    let targetPlanId = plan_id;
    if (!targetPlanId) {
      const planResult = await pool.query(
        "SELECT id FROM plans WHERE is_premium = true LIMIT 1"
      );
      if (planResult.rows.length > 0) {
        targetPlanId = planResult.rows[0].id;
      }
    }

    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const ref = `PAY-${dateStr}-${randomSuffix}`;

    const isYearly = billing_cycle === 'yearly';
    const endDate = isYearly
      ? new Date(today.getTime() + (365 * 24 * 60 * 60 * 1000))
      : new Date(today.getTime() + (30 * 24 * 60 * 60 * 1000));

    const query = `
      INSERT INTO user_subscriptions (
        user_id,
        plan_id,
        status,
        payment_method,
        receipt,
        ref,
        billing_cycle,
        amount,
        end_date
      )
      VALUES ($1, $2, 'pending', $3, $4, $5, $6, $7, $8)
      RETURNING id, user_id, plan_id, status, payment_method, receipt, ref, billing_cycle, amount, end_date, created_at
    `;

    const result = await pool.query(query, [
      resolvedUserId,
      targetPlanId,
      payment_method,
      receiptPath,
      ref,
      billing_cycle || 'monthly',
      amount || (isYearly ? 600000 : 60000),
      endDate
    ]);

    res.status(201).json({
      success: true,
      message: "Payment submitted successfully",
      ref: ref,
      filename: filename,
      billing_cycle: billing_cycle || 'monthly',
      amount: amount || (isYearly ? 600000 : 60000),
      subscription: result.rows[0]
    });

  } catch (error) {

    if (req.file) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkErr) {
        console.error('Failed to delete uploaded file:', unlinkErr);
      }
    }

    console.error('Error submitting payment:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);

    if (error.code === '23503') {
      return res.status(400).json({ message: "Invalid user_id or plan_id provided" });
    }

    if (error.code === '23514') {
      return res.status(400).json({ message: "Invalid payment method selected" });
    }

    if (error.code === '42703') {
      return res.status(500).json({ message: "Database schema error: missing column. Please run migrations." });
    }

    if (error.code === '42P01') {
      return res.status(500).json({ message: "Database schema error: table not found. Please run migrations." });
    }

    return res.status(500).json({
      message: "Error submitting payment",
      error: error.message,
      code: error.code
    });
  }
};

export { submitPayment };
