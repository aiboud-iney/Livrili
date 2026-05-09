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
