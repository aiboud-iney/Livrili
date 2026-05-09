import pool from '../config/db.js';
import bcrypt from 'bcrypt';
import { createAuditLog } from './auditLogController.js';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const createUser = async (req, res) => {
  const {
    email,
    password,
    business_name,
    phone_number,
    tin_nif,
    trade_register,
    user_type
  } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = `
      INSERT INTO users (
        email,
        password,
        business_name,
        phone_number,
        tin_nif,
        trade_register,
        user_type,
        verified
      )
      VALUES ($1, $2, $3, $4, $5, $6, COALESCE($7, 'user'), $8)
      RETURNING id, email, business_name, phone_number, tin_nif,
                trade_register, user_type, verified, created_at
    `;

    const result = await pool.query(query, [
      email,
      hashedPassword,
      business_name,
      phone_number,
      tin_nif,
      trade_register,
      user_type,
      false
    ]);

    res.status(201).json({ message: "User created", user: result.rows[0] });

  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: "Error creating user" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
        u.id,
        u.email,
        u.business_name,
        u.phone_number,
        u.user_type,
        u.verified,
        u.verification,
        CASE
          WHEN u.verification = true THEN 'verified'
          ELSE 'not_requested'
        END as verification_status,
        u.headquarters_address as wilaya,
        u.trade_register,
        u.tin_nif as nif,
        u.created_at,
        u.updated_at,
        p.name as active_plan_name,
        us.status as subscription_status
       FROM users u
       LEFT JOIN user_subscriptions us ON us.user_id = u.id AND us.status = 'active'
       LEFT JOIN plans p ON p.id = us.plan_id
       ORDER BY u.created_at DESC`
    );

    res.status(200).json({ message: "All users", users: result.rows });

  } catch (error) {
    console.error('Error getting users:', error);
    res.status(500).json({ message: "Error getting users" });
  }
};

const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `SELECT id, email, business_name, phone_number,
              tin_nif, trade_register, user_type, verified,
              verification_date, created_at, updated_at, more_details, category, headquarters_address, profile_picture,
              COALESCE(verification_status, 'not_requested') as verification_status,
              verification_requested_at,
              verification_rejected_reason
       FROM users
       WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User found", user: result.rows[0] });

  } catch (error) {
    console.error('Error getting user:', error);
    res.status(500).json({ message: "Error getting user" });
  }
};
const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'DELETE FROM users WHERE id = $1 RETURNING id, email, business_name',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    createAuditLog(req.user?.id, 'DELETED', 'user', id, {
      userAccount: result.rows[0].business_name || result.rows[0].email,
      targetEmail: result.rows[0].email,
    });

    res.status(200).json({ message: "User deleted" });

  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: "Error deleting user" });
  }
};

const getUserContactById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `SELECT business_name, phone_number FROM users WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = result.rows[0];
    res.status(200).json({ user });
  } catch (error) {
    console.error('Error getting user contact:', error);
    res.status(500).json({ message: "Error getting user contact" });
  }
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const {
    business_name,
    phone_number,
    tin_nif,
    trade_register,
    category,
    headquarters_address,
    more_details,
    email
  } = req.body;

  try {

    const userCheck = await pool.query(
      "SELECT * FROM users WHERE id = $1",
      [id]
    );

    if (userCheck.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const existingUser = userCheck.rows[0];

    let profilePicturePath = existingUser.profile_picture;

    if (req.file) {

      if (existingUser.profile_picture) {
        const oldPicturePath = path.join(__dirname, '../../', existingUser.profile_picture);
        if (fs.existsSync(oldPicturePath)) {
          try {
            fs.unlinkSync(oldPicturePath);
          } catch (err) {
            console.error('Error deleting old profile picture:', err);
          }
        }
      }

      profilePicturePath = req.file.path;
    }

    if (email && email !== existingUser.email) {
      const emailCheck = await pool.query(
        "SELECT * FROM users WHERE email = $1 AND id != $2",
        [email, id]
      );

      if (emailCheck.rows.length > 0) {
        return res.status(400).json({ message: "Email already in use" });
      }
    }

    const query = `
      UPDATE users
      SET business_name = COALESCE($1, business_name),
          phone_number = COALESCE($2, phone_number),
          tin_nif = COALESCE($3, tin_nif),
          trade_register = COALESCE($4, trade_register),
          category = COALESCE($5, category),
          headquarters_address = COALESCE($6, headquarters_address),
          more_details = COALESCE($7, more_details),
          email = COALESCE($8, email),
          profile_picture = COALESCE($9, profile_picture),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $10
      RETURNING id, email, business_name, phone_number,
                tin_nif, trade_register, user_type, verified, updated_at,
                category, headquarters_address, more_details as bio, profile_picture
    `;

    const result = await pool.query(query, [
      business_name || null,
      phone_number || null,
      tin_nif || null,
      trade_register || null,
      category || null,
      headquarters_address || null,
      more_details || null,
      email || null,
      profilePicturePath || null,
      id
    ]);

    res.status(200).json({ message: "User updated", user: result.rows[0] });

  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: "Error updating user", error: error.message });
  }
};

const updateProfilePicture = async (req, res) => {
  const { id } = req.params;
  try {

    const userCheck = await pool.query(
      "SELECT * FROM users WHERE id = $1",
      [id]
    );

    if (userCheck.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const existingUser = userCheck.rows[0];

    let profilePicturePath = existingUser.profile_picture;

    if (req.file) {

      if (existingUser.profile_picture) {
        const oldPicturePath = path.join(__dirname, '../../', existingUser.profile_picture);
        if (fs.existsSync(oldPicturePath)) {
          try {
            fs.unlinkSync(oldPicturePath);
          } catch (err) {
            console.error('Error deleting old profile picture:', err);
          }
        }
      }

      profilePicturePath = req.file.path;
    }

    const updateQuery = `
      UPDATE users
      SET profile_picture = $1
      WHERE id = $2
      RETURNING *;
    `;

    const values = [profilePicturePath, id];
    const result = await pool.query(updateQuery, values);

    res.status(200).json({
      message: 'Profile picture updated successfully',
      profile_picture: profilePicturePath

    });

  } catch (error) {
    console.error('Error updating profile picture:', error);
    res.status(500).json({ message: error.message || 'Internal server error' });
  }
};

const getPendingVerifications = async (req, res) => {
  try {
    const query = `
      SELECT
        id,
        business_name,
        headquarters_address,
        trade_register,
        tin_nif,
        profile_picture,
        created_at
      FROM users
      WHERE verification = false
      ORDER BY created_at DESC
    `;

    const { rows } = await pool.query(query);
    res.status(200).json(rows);

  } catch (error) {
    console.error("Error fetching pending verifications:", error);
    res.status(500).json({ error: "Failed to fetch pending verifications" });
  }
};

const requestVerification = async (req, res) => {
  const { id } = req.params;

  try {

    const checkResult = await pool.query(
      `SELECT verification_status, verification FROM users WHERE id = $1`,
      [id]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const currentStatus = checkResult.rows[0].verification_status || 'not_requested';
    const isVerified = checkResult.rows[0].verification;

    if (isVerified || currentStatus === 'verified') {
      return res.status(400).json({ message: "User is already verified" });
    }

    if (currentStatus === 'pending') {
      return res.status(400).json({ message: "Verification request is already pending" });
    }

    const { rows } = await pool.query(
      `UPDATE users
       SET verification_status = 'pending',
           verification_requested_at = NOW(),
           updated_at = NOW()
       WHERE id = $1
       RETURNING id, business_name, email, verification_status, verification_requested_at`,
      [id]
    );

    res.status(200).json({
      message: "Verification request submitted successfully",
      user: rows[0]
    });
  } catch (error) {
    console.error("Error requesting verification:", error);
    res.status(500).json({ error: "Failed to submit verification request" });
  }
};

const approveUserVerification = async (req, res) => {
  const { id } = req.params;

  try {
    const { rows } = await pool.query(
      `UPDATE users
       SET verified = true,
           verification = true,
           verification_date = NOW(),
           updated_at = NOW()
       WHERE id = $1
       RETURNING id, business_name, email, verified, verification, verification_date`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    await pool.query(
      `INSERT INTO notifications (user_id, title, message, type)
       VALUES ($1, 'Account Verified', 'Your business documents have been approved. You now have full access to Livrili.', 'success')`,
      [id]
    ).catch(() => {});

    createAuditLog(req.user?.id, 'VERIFIED', 'user', id, {
      userAccount: rows[0].business_name || rows[0].email,
      targetEmail: rows[0].email,
    });

    res.status(200).json({
      message: "User successfully verified by admin",
      user: rows[0]
    });
  } catch (error) {
    console.error("Error updating user verification:", error);
    res.status(500).json({ error: "Failed to verify user" });
  }
};

export {
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
};