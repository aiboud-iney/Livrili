import path from "path";
import express from "express";
import { fileURLToPath } from "url";
import cors from "cors";

import userRoutes         from "./routes/userRoutes.js";
import authRoutes         from "./routes/authRoutes.js";
import shipmentRoutes     from "./routes/shipmentRoutes.js";
import routeRoutes        from "./routes/routeRoutes.js";
import truckRoutes        from "./routes/truckRoutes.js";
import planRoutes         from "./routes/planRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import userSubsRoutes     from "./routes/userSubsRoutes.js";
import paymentRoutes      from "./routes/paymentRoutes.js";
import exportRoutes       from "./routes/exportRoutes.js";
import auditRoutes        from "./routes/auditRoutes.js";
import pool               from "./config/db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:3000" }));

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

app.use((req, res, next) => {
  const contentType = req.headers['content-type'] || '';
  if (contentType.includes('multipart/form-data')) {
    return next();
  }
  express.json()(req, res, next);
});

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use("/api/users",          userRoutes);
app.use("/api/auth",           authRoutes);
app.use("/api/shipments",      shipmentRoutes);
app.use("/api/routes",         routeRoutes);
app.use("/api/trucks",         truckRoutes);
app.use("/api/plans",          planRoutes);
app.use("/api/userSubs",       userSubsRoutes);
app.use("/api/payments",       paymentRoutes);
app.use("/api/notifications",  notificationRoutes);
app.use("/api/export",         exportRoutes);
app.use("/api/audit-logs",     auditRoutes);

app.get("/dbcheck", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json(result.rows);
  } catch (err) {
    res.status(500).send("Database error");
  }
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal server error" });
});

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server running on http://localhost:${process.env.PORT || 5000}`);
});
