import pool from "../config/db.js";
import * as XLSX from "xlsx";

const buildWorkbook = (rows, sheetName) => {
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(rows);
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  return XLSX.write(wb, { type: "buffer", bookType: "xlsx" });
};

const sendXlsx = (res, buffer, filename) => {
  res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
  res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
  res.send(buffer);
};

export const exportShipments = async (req, res) => {
  try {
    const isAdmin = req.user.user_type === "admin";
    const query   = isAdmin
      ? "SELECT * FROM shipments ORDER BY created_at DESC"
      : "SELECT * FROM shipments WHERE created_by = $1 ORDER BY created_at DESC";
    const params  = isAdmin ? [] : [req.user.id];

    const result = await pool.query(query, params);
    const rows = result.rows.map(row => ({
      ...row,
      shipment_pictures: Array.isArray(row.shipment_pictures)
        ? row.shipment_pictures.join(", ")
        : row.shipment_pictures,
    }));

    sendXlsx(res, buildWorkbook(rows, "Shipments"), "shipments_export.xlsx");
  } catch (error) {
    console.error("Error exporting shipments:", error);
    res.status(500).json({ message: "Error exporting shipments" });
  }
};

export const exportRoutes = async (req, res) => {
  try {
    const isAdmin = req.user.user_type === "admin";
    const query   = isAdmin
      ? "SELECT * FROM routes ORDER BY created_at DESC"
      : "SELECT * FROM routes WHERE posted_by = $1 ORDER BY created_at DESC";
    const params  = isAdmin ? [] : [req.user.id];

    const result = await pool.query(query, params);
    const rows = result.rows.map(row => ({
      ...row,
      transit_cities: Array.isArray(row.transit_cities)
        ? row.transit_cities.join(", ")
        : row.transit_cities,
    }));

    sendXlsx(res, buildWorkbook(rows, "Routes"), "routes_export.xlsx");
  } catch (error) {
    console.error("Error exporting routes:", error);
    res.status(500).json({ message: "Error exporting routes" });
  }
};

export const exportTrucks = async (req, res) => {
  try {
    const isAdmin = req.user.user_type === "admin";
    const query   = isAdmin
      ? "SELECT * FROM trucks ORDER BY id ASC"
      : "SELECT * FROM trucks WHERE created_by = $1 ORDER BY id ASC";
    const params  = isAdmin ? [] : [req.user.id];

    const result = await pool.query(query, params);
    const rows = result.rows.map(row => ({
      ...row,
      truck_pictures: Array.isArray(row.truck_pictures)
        ? row.truck_pictures.join(", ")
        : row.truck_pictures,
    }));

    sendXlsx(res, buildWorkbook(rows, "Trucks"), "trucks_export.xlsx");
  } catch (error) {
    console.error("Error exporting trucks:", error);
    res.status(500).json({ message: "Error exporting trucks" });
  }
};

export const exportSubscriptions = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        us.id,
        u.business_name,
        u.email,
        p.name         AS plan_name,
        us.status,
        us.payment_method,
        COALESCE(us.amount, p.price) AS amount,
        us.billing_cycle,
        us.ref,
        us.start_date,
        us.end_date,
        us.created_at
      FROM user_subscriptions us
      JOIN users u  ON us.user_id  = u.id
      JOIN plans p  ON us.plan_id  = p.id
      ORDER BY us.created_at DESC
    `);

    sendXlsx(res, buildWorkbook(result.rows, "Subscriptions"), "subscriptions_export.xlsx");
  } catch (error) {
    console.error("Error exporting subscriptions:", error);
    res.status(500).json({ message: "Error exporting subscriptions" });
  }
};

export const exportAuditLogs = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
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
    `);

    const rows = result.rows.map(row => ({
      id:          row.id,
      admin_name:  row.admin_name || row.admin_email || 'System',
      action:      row.action,
      entity:      row.entity,
      entity_id:   row.entity_id,
      details:     typeof row.details === 'object' ? JSON.stringify(row.details) : row.details,
      created_at:  row.created_at,
    }));

    sendXlsx(res, buildWorkbook(rows, "Audit Logs"), "audit_logs_export.xlsx");
  } catch (error) {
    console.error("Error exporting audit logs:", error);
    res.status(500).json({ message: "Error exporting audit logs" });
  }
};

export const exportUsers = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        u.id,
        u.email,
        u.business_name,
        u.phone_number,
        u.tin_nif,
        u.trade_register,
        u.user_type,
        u.verified,
        u.verification,
        u.created_at,
        COALESCE(us.status, 'free') AS subscription_status,
        p.name                       AS plan_name
      FROM users u
      LEFT JOIN user_subscriptions us ON us.user_id = u.id
        AND us.status IN ('active', 'pending')
      LEFT JOIN plans p ON us.plan_id = p.id
      ORDER BY u.created_at DESC
    `);

    const rows = result.rows.map(row => ({
      id:                  row.id,
      email:               row.email,
      business_name:       row.business_name,
      phone_number:        row.phone_number,
      tin_nif:             row.tin_nif,
      trade_register:      row.trade_register,
      user_type:           row.user_type,
      verified:            row.verified,
      verification:        row.verification,
      subscription_status: row.subscription_status,
      plan_name:           row.plan_name || 'Free',
      created_at:          row.created_at,
    }));

    sendXlsx(res, buildWorkbook(rows, "Users"), "users_export.xlsx");
  } catch (error) {
    console.error("Error exporting users:", error);
    res.status(500).json({ message: "Error exporting users" });
  }
};
