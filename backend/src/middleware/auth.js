import jwt from "jsonwebtoken";
import pool from "../config/db.js";

export const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const result = await pool.query("SELECT * FROM users WHERE id = $1", [decoded.id]);
    if (result.rows.length === 0) {
      return res.status(401).json({ message: "User no longer exists" });
    }

    req.user = result.rows[0];
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export const authorizeUserOrAdmin = (req, res, next) => {
  const { id } = req.params;
  if (req.user.user_type === "admin" || String(req.user.id) === String(id)) {
    return next();
  }
  return res.status(403).json({ message: "Forbidden" });
};

export const authorizeAdmin = (req, res, next) => {
  if (req.user.user_type === "admin") {
    return next();
  }
  return res.status(403).json({ message: "Forbidden: admin only" });
};
