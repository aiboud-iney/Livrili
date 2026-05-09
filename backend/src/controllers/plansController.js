import pool from '../config/db.js';

const createPlan = async (req, res) => {
  const { name, description, price, duration_days, is_premium = false } = req.body;

  try {
    const query = `
      INSERT INTO plans (name, description, price, duration_days, is_premium)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, name, description, price, duration_days, is_premium, created_at
    `;

    const result = await pool.query(query, [name, description, price, duration_days, is_premium]);

    res.status(201).json({ message: "Plan created", plan: result.rows[0] });

  } catch (error) {
    console.error('Error creating plan:', error);

    if (error.code === '23505') {
      return res.status(409).json({ message: "A plan with this name already exists" });
    }
    res.status(500).json({ message: "Error creating plan" });
  }
};

const getAllPlans = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, name, description, price, duration_days, is_premium, created_at
       FROM plans
       ORDER BY price ASC`
    );

    res.status(200).json({ message: "All plans", plans: result.rows });

  } catch (error) {
    console.error('Error getting plans:', error);
    res.status(500).json({ message: "Error getting plans" });
  }
};

const getPlanById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `SELECT id, name, description, price, duration_days, created_at, updated_at
       FROM plans
       WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Plan not found" });
    }

    res.status(200).json({ message: "Plan found", plan: result.rows[0] });

  } catch (error) {
    console.error('Error getting plan:', error);
    res.status(500).json({ message: "Error getting plan" });
  }
};

const updatePlan = async (req, res) => {
  const { id } = req.params;
  const {
    name,
    description,
    price,
    duration_days
  } = req.body;

  try {
    const query = `
      UPDATE plans
      SET name = COALESCE($1, name),
          description = COALESCE($2, description),
          price = COALESCE($3, price),
          duration_days = COALESCE($4, duration_days),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $5
      RETURNING id, name, description, price, duration_days, updated_at
    `;

    const result = await pool.query(query, [
      name,
      description,
      price,
      duration_days,
      id
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Plan not found" });
    }

    res.status(200).json({ message: "Plan updated", plan: result.rows[0] });

  } catch (error) {
    console.error('Error updating plan:', error);
    if (error.code === '23505') {
      return res.status(409).json({ message: "A plan with this name already exists" });
    }
    res.status(500).json({ message: "Error updating plan" });
  }
};

const deletePlan = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'DELETE FROM plans WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Plan not found" });
    }

    res.status(200).json({ message: "Plan deleted" });

  } catch (error) {
    console.error('Error deleting plan:', error);

    if (error.code === '23503') {
      return res.status(400).json({
        message: "Cannot delete this plan because users are currently subscribed to it."
      });
    }
    res.status(500).json({ message: "Error deleting plan" });
  }
};

export {
  createPlan,
  getAllPlans,
  getPlanById,
  updatePlan,
  deletePlan
};