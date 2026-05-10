import pool from "../config/db.js";
import { createNotification } from "./notificationController.js";

export const getAllTrucks = async (req, res) => {
  const { created_by, page, limit } = req.query;

  const conditions = [];
  const values = [];

  if (req.user.user_type !== "admin") {
    values.push(req.user.id);
    conditions.push(`created_by = $${values.length}`);
  } else if (created_by) {
    values.push(created_by);
    conditions.push(`created_by = $${values.length}`);
  }

  let sql = "SELECT * FROM trucks";
  if (conditions.length) sql += " WHERE " + conditions.join(" AND ");

  const perPage = parseInt(limit, 10) || 20;
  const offset  = (parseInt(page, 10) || 0) * perPage;
  sql += ` ORDER BY id LIMIT ${perPage} OFFSET ${offset}`;

  try {
    const result = await pool.query(sql, values);
    res.status(200).json({ trucks: result.rows });
  } catch (error) {
    console.error("Error fetching trucks:", error);
    res.status(500).json({ message: "Error fetching trucks" });
  }
};

export const getTruckById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query("SELECT * FROM trucks WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Truck not found" });
    }

    const truck = result.rows[0];

    if (req.user.user_type !== "admin" && req.user.id !== truck.created_by) {
      return res.status(403).json({ message: "Forbidden" });
    }

    res.status(200).json({ truck });
  } catch (error) {
    console.error("Error fetching truck:", error);
    res.status(500).json({ message: "Error fetching truck" });
  }
};

export const createTruck = async (req, res) => {
  const { name, truck_type, max_tonnage, max_volume, license_plate } = req.body;

  try {
    const truckPictures = req.files
      ? req.files.map((file) => `${req.protocol}://${req.get("host")}/uploads/trucks/${file.filename}`)
      : [];

    const tonnageNum = max_tonnage ? parseFloat(max_tonnage) : null;
    const volumeNum = max_volume ? parseFloat(max_volume) : null;

    const query = `
      INSERT INTO trucks (name, truck_type, max_tonnage, max_volume, license_plate, created_by, truck_pictures)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;

    const values = [
      name          || null,
      truck_type    || null,
      tonnageNum,
      volumeNum,
      license_plate || null,
      req.user.id,
      truckPictures,
    ];

    const result = await pool.query(query, values);
    return res.status(201).json({ truck: result.rows[0] });
  } catch (error) {
    console.error("Error creating truck:", error);
    console.error("Error details:", error.message);
    console.error("Request body:", req.body);
    res.status(500).json({ message: "Error creating truck: " + (error.message || "Unknown error") });
  }
};

export const updateTruck = async (req, res) => {
  const { id } = req.params;
  const { name, truck_type, max_tonnage, max_volume, license_plate } = req.body;

  try {
    const truckRes = await pool.query("SELECT * FROM trucks WHERE id = $1", [id]);
    if (truckRes.rows.length === 0) {
      return res.status(404).json({ message: "Truck not found" });
    }

    const truck = truckRes.rows[0];

    if (req.user.user_type !== "admin" && req.user.id !== truck.created_by) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const updates = [];
    const values  = [];

    if (name          !== undefined) { values.push(name);          updates.push(`name = $${values.length}`); }
    if (truck_type    !== undefined) { values.push(truck_type);    updates.push(`truck_type = $${values.length}`); }
    if (max_tonnage   !== undefined) { values.push(max_tonnage);   updates.push(`max_tonnage = $${values.length}`); }
    if (max_volume    !== undefined) { values.push(max_volume);    updates.push(`max_volume = $${values.length}`); }
    if (license_plate !== undefined) { values.push(license_plate); updates.push(`license_plate = $${values.length}`); }

    if (updates.length === 0) {
      return res.status(400).json({ message: "No fields provided to update" });
    }

    values.push(id);
    const query = `UPDATE trucks SET ${updates.join(", ")} WHERE id = $${values.length} RETURNING *`;

    const result = await pool.query(query, values);
    res.status(200).json({ truck: result.rows[0] });
  } catch (error) {
    console.error("Error updating truck:", error);
    res.status(500).json({ message: "Error updating truck" });
  }
};

export const deleteTruck = async (req, res) => {
  const { id } = req.params;

  try {
    const truckRes = await pool.query("SELECT * FROM trucks WHERE id = $1", [id]);
    if (truckRes.rows.length === 0) {
      return res.status(404).json({ message: "Truck not found" });
    }

    const truck = truckRes.rows[0];

    if (req.user.user_type !== "admin" && req.user.id !== truck.created_by) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const activeRoute = await pool.query(
      "SELECT id FROM routes WHERE assigned_truck_id = $1 AND status NOT IN ('completed','cancelled') LIMIT 1",
      [id]
    );
    if (activeRoute.rows.length > 0) {
      return res.status(409).json({ message: "Cannot delete a truck that is assigned to an active route" });
    }

    await pool.query("DELETE FROM trucks WHERE id = $1", [id]);
    res.status(200).json({ message: "Truck deleted successfully" });
  } catch (error) {
    console.error("Error deleting truck:", error);
    res.status(500).json({ message: "Error deleting truck" });
  }
};

export const addTruckPhotos = async (req, res) => {
  const { id } = req.params;
  try {
    const truckRes = await pool.query("SELECT * FROM trucks WHERE id = $1", [id]);
    if (truckRes.rows.length === 0) return res.status(404).json({ message: "Truck not found" });

    const truck = truckRes.rows[0];

    if (req.user.user_type !== "admin" && req.user.id !== truck.created_by) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const newUrls = req.files
      ? req.files.map((f) => `${req.protocol}://${req.get("host")}/uploads/trucks/${f.filename}`)
      : [];

    const existing = truck.truck_pictures || [];
    const updated = [...existing, ...newUrls];

    await pool.query("UPDATE trucks SET truck_pictures = $1 WHERE id = $2", [updated, id]);
    res.json({ truck_pictures: updated });
  } catch (error) {
    console.error("Error adding truck photos:", error);
    res.status(500).json({ message: "Error adding photos" });
  }
};

export const getMyTrucksCount = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT COUNT(*)::int AS total FROM trucks WHERE created_by = $1",
      [req.user.id],
    );

    res.status(200).json({ total: result.rows[0].total });
  } catch (error) {
    console.error("Error counting trucks:", error);
    res.status(500).json({ message: "Error counting trucks" });
  }
};
