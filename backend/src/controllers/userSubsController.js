import pool from '../config/db.js';
import path from 'path';
import fs from 'fs';
import sendEmail, {
  sendSubscriptionAcceptedEmail,
  sendSubscriptionRejectedEmail
} from '../utils/mailer.js';

const createSubscription = async (req, res) => {
  const {
    user_id,
    plan_id,
    payment_method
  } = req.body;

  if (!req.file) {
    return res.status(400).json({ message: "Payment receipt image is required" });
  }

  const receiptPath = req.file.path;
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

    const query = `
      INSERT INTO user_subscriptions (
        user_id,
        plan_id,
        status,
        payment_method,
        receipt
      )
      VALUES ($1, $2, 'pending', $3, $4)
      RETURNING id, user_id, plan_id, status, payment_method, receipt, end_date, created_at
    `;

    const result = await pool.query(query, [
      resolvedUserId,
      plan_id,
      payment_method,
      receiptPath
    ]);

    res.status(201).json({
      message: "Subscription request submitted successfully",
      subscription: result.rows[0]
    });

  } catch (error) {

    if (req.file) {
      fs.unlinkSync(req.file.path);
    }

    console.error('Error creating subscription:', error);

    if (error.code === '23503') {
      return res.status(400).json({ message: "Invalid user_id or plan_id provided" });
    }

    if (error.code === '23514') {
      return res.status(400).json({ message: "Invalid payment method selected" });
    }

    res.status(500).json({ message: "Error creating subscription" });
  }
};

const getAllSubscriptions = async (req, res) => {
  try {
    const query = `
      SELECT
        us.id,
        us.status,
        us.payment_method,
        us.receipt,
        us.created_at,
        us.start_date,
        us.end_date,
        u.business_name,
        u.profile_picture,
        u.email,
        p.name AS plan_name,
        p.price AS amount,
        p.duration_days
      FROM user_subscriptions us
      JOIN users u ON us.user_id = u.id
      JOIN plans p ON us.plan_id = p.id
      ORDER BY us.created_at DESC
    `;

    const result = await pool.query(query);

    res.status(200).json({ message: "All subscriptions", subscriptions: result.rows });

  } catch (error) {
    console.error('Error getting subscriptions:', error);
    res.status(500).json({ message: "Error getting subscriptions" });
  }
};

const getSubscriptionById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `SELECT id, user_id, plan_id, status, start_date, end_date, created_at, updated_at
       FROM user_subscriptions
       WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    res.status(200).json({ message: "Subscription found", subscription: result.rows[0] });

  } catch (error) {
    console.error('Error getting subscription:', error);
    res.status(500).json({ message: "Error getting subscription" });
  }
};

const getSubscriptionsByUserId = async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await pool.query(
      `SELECT us.id, us.user_id, us.plan_id, us.status, us.start_date, us.end_date,
              us.billing_cycle, us.amount, us.payment_method, us.ref, us.receipt,
              p.name AS plan_name, p.description AS plan_description
       FROM user_subscriptions us
       JOIN plans p ON us.plan_id = p.id
       WHERE us.user_id = $1
       ORDER BY us.created_at DESC`,
      [userId]
    );

    res.status(200).json({ message: "User subscriptions found", subscriptions: result.rows });

  } catch (error) {
    console.error('Error getting user subscriptions:', error);
    res.status(500).json({ message: "Error getting user subscriptions" });
  }
};

const getUserSubscription = async (req, res) => {
  try {

    const userId = req.user.id;

    const query = `
      SELECT * FROM user_subscriptions
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT 1
    `;

    const { rows } = await pool.query(query, [userId]);

    if (rows.length === 0) {
      return res.status(200).json({
        currentStatus: 'free',
        subscription: null
      });
    }

    const currentSub = rows[0];

    return res.status(200).json({
      currentStatus: currentSub.status.toLowerCase(),
      subscription: currentSub
    });

  } catch (error) {
    console.error("Error fetching user subscription:", error);
    res.status(500).json({ error: "Failed to fetch subscription data" });
  }
};

const updateSubscription = async (req, res) => {
  const { id } = req.params;
  const {
    plan_id,
    status,
    end_date
  } = req.body;

  try {
    const query = `
      UPDATE user_subscriptions
      SET plan_id = COALESCE($1, plan_id),
          status = COALESCE($2, status),
          end_date = COALESCE($3, end_date),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $4
      RETURNING id, user_id, plan_id, status, start_date, end_date, updated_at
    `;

    const result = await pool.query(query, [
      plan_id,
      status,
      end_date,
      id
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    res.status(200).json({ message: "Subscription updated", subscription: result.rows[0] });

  } catch (error) {
    console.error('Error updating subscription:', error);
    res.status(500).json({ message: "Error updating subscription" });
  }
};

const deleteSubscription = async (req, res) => {
  const { id } = req.params;

  try {

    const findQuery = `
      SELECT us.receipt, u.email, u.business_name, p.name as plan_name
      FROM user_subscriptions us
      JOIN users u ON us.user_id = u.id
      JOIN plans p ON us.plan_id = p.id
      WHERE us.id = $1
    `;
    const subResult = await pool.query(findQuery, [id]);

    if (subResult.rows.length === 0) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    const { receipt, email, business_name, plan_name } = subResult.rows[0];

    await pool.query('DELETE FROM user_subscriptions WHERE id = $1', [id]);

    if (receipt && fs.existsSync(receipt)) {
      try {
        fs.unlinkSync(receipt);
      } catch (fileError) {
        console.error('Error deleting receipt file:', fileError);

      }
    }

    await sendSubscriptionRejectedEmail(email, {
      name: business_name,
      planName: plan_name,
      reason: 'Your payment receipt could not be verified. Please check your payment details and try again.'
    });

    await pool.query(
      `INSERT INTO notifications (user_id, title, message, type)
       VALUES ($1, 'Subscription Rejected', 'Your subscription payment was rejected. Please check your payment details and resubmit.', 'error')`,
      [subResult.rows[0].user_id]
    ).catch(() => {});

    res.status(200).json({ message: "Subscription rejected and user notified" });

  } catch (error) {
    console.error('Error deleting subscription:', error);
    res.status(500).json({ message: "Error deleting subscription" });
  }
};

const activateSubscription = async (req, res) => {
  const { id } = req.params;

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const subRes = await client.query(
      "SELECT user_id FROM user_subscriptions WHERE id = $1",
      [id]
    );
    if (subRes.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Subscription record not found" });
    }
    const { user_id } = subRes.rows[0];

    await client.query(
      "UPDATE user_subscriptions SET status = 'expired', updated_at = NOW() WHERE user_id = $1 AND status = 'active' AND id != $2",
      [user_id, id]
    );

    const query = `
      UPDATE user_subscriptions us
      SET
        status     = 'active',
        start_date = NOW(),
        end_date   = NOW() + (p.duration_days || ' days')::interval,
        updated_at = NOW()
      FROM plans p
      WHERE us.plan_id = p.id
        AND us.id = $1
      RETURNING us.id, us.user_id, us.status, us.start_date, us.end_date
    `;
    const result = await client.query(query, [id]);

    await client.query("COMMIT");

    if (result.rows.length > 0) {
      await pool.query(
        `INSERT INTO notifications (user_id, title, message, type)
         VALUES ($1, 'Subscription Activated', 'Your premium subscription has been activated. Enjoy unlimited access!', 'success')`,
        [user_id]
      ).catch(() => {});

      const detailsRes = await pool.query(`
        SELECT u.email, u.business_name, p.name as plan_name, p.price, p.description,
               us.start_date, us.end_date, us.billing_cycle, us.amount
        FROM user_subscriptions us
        JOIN users u ON us.user_id = u.id
        JOIN plans p ON us.plan_id = p.id
        WHERE us.id = $1
      `, [id]);
      if (detailsRes.rows.length > 0) {
        const d = detailsRes.rows[0];
        sendSubscriptionAcceptedEmail(d.email, {
          name: d.business_name,
          planName: d.plan_name,
          amount: d.amount || d.price,
          startDate: d.start_date,
          endDate: d.end_date,
          billingCycle: d.billing_cycle,
          features: d.description ? d.description.split(',').map(s => s.trim()) : [],
        }).catch(err => console.error('Failed to send subscription email:', err.message));
      }
    }

    res.status(200).json({
      message: "Subscription activated successfully",
      subscription: result.rows[0]
    });

  } catch (error) {
    await client.query("ROLLBACK").catch(() => {});
    console.error("Error activating subscription:", error);
    res.status(500).json({ message: "Error activating subscription" });
  } finally {
    client.release();
  }
};

const getPendingSubscriptions = async (req, res) => {
  try {
    const query = `
          SELECT
            us.id,
            us.status,
            us.payment_method,
            us.receipt,
            us.created_at,
            u.business_name,
            u.profile_picture,
            p.name AS plan_name,
            p.price AS amount,
            p.duration_days
          FROM user_subscriptions us
          JOIN users u ON us.user_id = u.id
          JOIN plans p ON us.plan_id = p.id
          WHERE us.status = 'pending'
          ORDER BY us.created_at DESC
        `;

    const result = await pool.query(query);

    res.status(200).json({
      message: "Pending subscriptions fetched",
      pending: result.rows
    });

  } catch (error) {
    console.error('Error getting pending subscriptions:', error);
    res.status(500).json({ message: "Error getting pending subscriptions" });
  }
};

const getSubscriptionStats = async (req, res) => {
  try {

    const { rows } = await pool.query(`
      SELECT
        COUNT(*) FILTER (WHERE status = 'pending') AS pending,
        COUNT(*) FILTER (WHERE status = 'active')  AS active
      FROM user_subscriptions
    `);
    res.status(200).json({
      pending:   parseInt(rows[0].pending, 10),
      activePro: parseInt(rows[0].active,  10),
    });

  } catch (error) {
    console.error("Error getting subscription stats:", error);
    res.status(500).json({ error: "Failed to fetch subscription stats" });
  }
};

const getPaymentHistory = async (req, res) => {
  const { userId } = req.params;

  try {

    const query = `
      SELECT
        us.id,
        us.created_at as date,
        us.payment_method as method,
        us.status,
        us.receipt,
        p.name as plan_name,
        COALESCE(us.amount, p.price) as amount,
        COALESCE(us.ref, CONCAT('PAY-', TO_CHAR(us.created_at, 'YYYYMMDD'), '-', us.id)) as ref,
        us.billing_cycle
      FROM user_subscriptions us
      JOIN plans p ON us.plan_id = p.id
      WHERE us.user_id = $1 AND us.status IN ('active', 'pending', 'expired')
        AND (p.price > 0 OR us.amount > 0)
      ORDER BY us.created_at DESC
    `;

    const result = await pool.query(query, [userId]);

    const payments = result.rows.map(row => ({
      id: row.id,
      date: new Date(row.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      ref: row.ref,
      amount: `${row.amount.toLocaleString()} DZD`,
      rawAmount: row.amount,
      method: row.method || 'Baridi Mob',
      status: row.status === 'active' ? 'Confirmed' : row.status === 'pending' ? 'Pending' : 'Expired',
      rawStatus: row.status,
      receipt: row.receipt,
      billing_cycle: row.billing_cycle
    }));

    res.status(200).json({
      message: "Payment history fetched",
      payments: payments
    });

  } catch (error) {
    console.error('Error getting payment history:', error);
    res.status(500).json({ message: "Error getting payment history" });
  }
};

const upgradeSubscription = async (req, res) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {

    const planResult = await pool.query(
      "SELECT id FROM plans WHERE is_premium = true LIMIT 1"
    );

    if (planResult.rows.length === 0) {
      return res.status(404).json({ message: "Premium plan not found" });
    }

    const premiumPlanId = planResult.rows[0].id;

    const existing = await pool.query(
      "SELECT id, status FROM user_subscriptions WHERE user_id = $1 AND status IN ('pending', 'active') LIMIT 1",
      [userId]
    );

    if (existing.rows.length > 0) {
      const status = existing.rows[0].status;
      if (status === 'active') {
        return res.status(409).json({ message: "You already have an active subscription" });
      }
      return res.status(409).json({ message: "You have a pending subscription request" });
    }

    const query = `
      INSERT INTO user_subscriptions (
        user_id,
        plan_id,
        status
      )
      VALUES ($1, $2, 'pending')
      RETURNING id, user_id, plan_id, status, created_at
    `;

    const result = await pool.query(query, [userId, premiumPlanId]);

    res.status(201).json({
      message: "Upgrade initiated. Please complete payment to activate.",
      subscription: result.rows[0]
    });

  } catch (error) {
    console.error('Error upgrading subscription:', error);
    res.status(500).json({ message: "Error upgrading subscription" });
  }
};

const renewSubscription = async (req, res) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {

    const subResult = await pool.query(
      `SELECT us.id, us.plan_id, p.duration_days
       FROM user_subscriptions us
       JOIN plans p ON us.plan_id = p.id
       WHERE us.user_id = $1 AND us.status = 'expired'
       ORDER BY us.end_date DESC
       LIMIT 1`,
      [userId]
    );

    if (subResult.rows.length === 0) {
      return res.status(404).json({ message: "No expired subscription found to renew" });
    }

    const expiredSub = subResult.rows[0];

    const existing = await pool.query(
      "SELECT id, status FROM user_subscriptions WHERE user_id = $1 AND status IN ('pending', 'active') LIMIT 1",
      [userId]
    );

    if (existing.rows.length > 0) {
      const status = existing.rows[0].status;
      if (status === 'active') {
        return res.status(409).json({ message: "You already have an active subscription" });
      }
      return res.status(409).json({ message: "You have a pending subscription request" });
    }

    const query = `
      INSERT INTO user_subscriptions (
        user_id,
        plan_id,
        status
      )
      VALUES ($1, $2, 'pending')
      RETURNING id, user_id, plan_id, status, created_at
    `;

    const result = await pool.query(query, [userId, expiredSub.plan_id]);

    res.status(201).json({
      message: "Renewal initiated. Please complete payment to activate.",
      subscription: result.rows[0]
    });

  } catch (error) {
    console.error('Error renewing subscription:', error);
    res.status(500).json({ message: "Error renewing subscription" });
  }
};

const choosePlan = async (req, res) => {
  const userId = req.user?.id;
  const { plan } = req.body;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!plan || !['free', 'premium'].includes(plan)) {
    return res.status(400).json({ message: "Invalid plan. Must be 'free' or 'premium'" });
  }

  try {

    const planResult = await pool.query(
      "SELECT id FROM plans WHERE is_premium = false OR price = 0 LIMIT 1"
    );

    if (planResult.rows.length === 0) {
      return res.status(404).json({ message: "Free plan not found" });
    }

    const freePlanId = planResult.rows[0].id;

    const existing = await pool.query(
      "SELECT id, status FROM user_subscriptions WHERE user_id = $1 AND status IN ('pending', 'active') LIMIT 1",
      [userId]
    );

    if (existing.rows.length > 0) {
      const status = existing.rows[0].status;
      if (status === 'active') {
        return res.status(200).json({
          success: true,
          plan: 'free',
          message: "You already have an active subscription"
        });
      }
      return res.status(409).json({ message: "You have a pending subscription request" });
    }

    const query = `
      INSERT INTO user_subscriptions (
        user_id,
        plan_id,
        status,
        start_date,
        end_date
      )
      VALUES ($1, $2, 'active', NOW(), NOW() + INTERVAL '100 years')
      RETURNING id, user_id, plan_id, status, start_date, end_date, created_at
    `;

    const result = await pool.query(query, [userId, freePlanId]);

    res.status(201).json({
      success: true,
      plan: 'free',
      message: "Free plan activated successfully",
      subscription: result.rows[0]
    });

  } catch (error) {
    console.error('Error choosing free plan:', error);
    res.status(500).json({ message: "Error choosing plan" });
  }
};

export {
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
};