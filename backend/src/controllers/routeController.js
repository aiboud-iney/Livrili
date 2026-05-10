import pool from "../config/db.js";

export const createRoute = async (req, res) => {
  const {
    origin,
    destination,
    transit_cities,
    departure_date,
    start_date,
    end_date,
    max_weight,
    max_volume,
    phonecountrycode,
    contact_phone,
    notes,
    truck_type,
    assigned_truck_id,
    route_type,
  } = req.body;

  const posted_by = req.user.id;
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const subQuery = `
      SELECT us.id FROM user_subscriptions us
      JOIN plans p ON us.plan_id = p.id
      WHERE us.user_id = $1 AND us.status = 'active' AND p.is_premium = true
      AND (us.end_date IS NULL OR us.end_date > NOW())
      LIMIT 1
    `;
    const subResult = await client.query(subQuery, [posted_by]);
    const hasPremium = subResult.rowCount > 0;

    if (!hasPremium) {
      const countQuery = `
        SELECT (SELECT COUNT(*) FROM shipments WHERE created_by = $1) +
               (SELECT COUNT(*) FROM routes WHERE posted_by = $1) AS total_count
      `;
      const countResult = await client.query(countQuery, [posted_by]);
      const totalCount = parseInt(countResult.rows[0].total_count, 10);

      if (totalCount >= 5) {
        await client.query("ROLLBACK");
        return res.status(403).json({
          message: "FREE_LIMIT_REACHED",
          error: "Free plan users can only post a combined maximum of 5 shipments and routes.",
        });
      }
    }

    if (assigned_truck_id !== undefined && assigned_truck_id !== null) {
      const truckRes = await client.query("SELECT * FROM trucks WHERE id = $1", [assigned_truck_id]);
      if (truckRes.rows.length === 0) {
        await client.query("ROLLBACK");
        return res.status(400).json({ message: "Assigned truck not found" });
      }
      if (req.user.user_type !== "admin" && truckRes.rows[0].created_by !== req.user.id) {
        await client.query("ROLLBACK");
        return res.status(403).json({ message: "Forbidden: cannot reference this truck" });
      }
    }

    const query = `
      INSERT INTO routes (posted_by, origin, destination, transit_cities, departure_date, end_date,
      max_weight, max_volume, phone_country_code, contact_phone, notes, truck_type, route_type, assigned_truck_id)
      VALUES ($1, $2, $3, $4::jsonb, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *
    `;

    const values = [
      posted_by, origin, destination, JSON.stringify(transit_cities || []),
      start_date || departure_date || null, end_date || null,
      max_weight, max_volume, phonecountrycode, contact_phone,
      notes || null, truck_type || null, route_type || "ONE_WAY",
      assigned_truck_id !== undefined ? assigned_truck_id : null,
    ];

    const result = await client.query(query, values);
    await client.query("COMMIT");
    res.status(201).json({ route: result.rows[0] });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error creating route:", error);
    res.status(500).json({ message: "Error creating route" });
  } finally {
    client.release();
  }
};

export const getRoute = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM routes WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Route not found" });
    }
    const route = result.rows[0];

    const assignedRes = await pool.query(
      `SELECT COALESCE(SUM(s.weight), 0) AS assigned_weight, COALESCE(SUM(s.volume), 0) AS assigned_volume
       FROM assignments a JOIN shipments s ON s.id = a.shipment_id
       WHERE a.route_id = $1 AND a.status != 'cancelled'`,
      [id]
    );
    const assignedWeight = parseFloat(assignedRes.rows[0].assigned_weight) || 0;
    const assignedVolume = parseFloat(assignedRes.rows[0].assigned_volume) || 0;
    const capacityWeight = parseFloat(route.max_weight) || 0;
    const capacityVolume = parseFloat(route.max_volume) || 0;

    const assignedShipmentsRes = await pool.query(
      `SELECT s.id, s.title, s.weight, s.volume, s.status
       FROM assignments a JOIN shipments s ON s.id = a.shipment_id
       WHERE a.route_id = $1`,
      [id]
    );

    res.status(200).json({
      ...route,
      assigned_weight: assignedWeight,
      assigned_volume: assignedVolume,
      remaining_capacity: capacityWeight - assignedWeight,
      remaining_volume: capacityVolume - assignedVolume,
      assigned_shipments: assignedShipmentsRes.rows,
    });
  } catch (error) {
    console.error("Error fetching route:", error);
    res.status(500).json({ message: "Error fetching route" });
  }
};

export const getAllRoutes = async (req, res) => {
  const {
    origin,
    destination,
    truckTypes,
    route_type,
    start_date,
    end_date,
    weightMin,
    weightMax,
    volumeMin,
    volumeMax,
    sortBy,
    userSearch,
    page,
    limit,
  } = req.query;

  const normalizeWilaya = (value) => {
    if (!value) return "";
    return String(value)
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();
  };

  const conditions = [];
  const values = [];
  const toArray = (v) => {
    if (!v) return [];
    return Array.isArray(v) ? v : String(v).split(",").map(s => s.trim()).filter(Boolean);
  };

  if (userSearch && userSearch.trim() !== "") {
    const searchTerm = `%${userSearch.trim()}%`;
    values.push(searchTerm);
    conditions.push(`EXISTS (
      SELECT 1 FROM users u
      WHERE u.id = routes.posted_by
      AND (u.business_name ILIKE $${values.length} OR u.email ILIKE $${values.length})
    )`);
  }

  const originArr = toArray(origin);
  if (originArr.length) {
    const normalizedOrigins = originArr.map(normalizeWilaya);
    const originConditions = [];
    for (let i = 0; i < normalizedOrigins.length; i++) {
      originConditions.push(`LOWER(REGEXP_REPLACE(origin, '[^a-zA-Z0-9]', '', 'g')) LIKE $${values.length + 1}`);
      values.push(`%${normalizedOrigins[i].replace(/[^a-zA-Z0-9]/g, '')}%`);
    }

    for (let i = 0; i < normalizedOrigins.length; i++) {
      originConditions.push(`EXISTS (
        SELECT 1 FROM jsonb_array_elements_text(COALESCE(transit_cities, '[]'::jsonb)) AS transit_city
        WHERE LOWER(REGEXP_REPLACE(transit_city, '[^a-zA-Z0-9]', '', 'g')) LIKE $${values.length + 1}
      )`);
      values.push(`%${normalizedOrigins[i].replace(/[^a-zA-Z0-9]/g, '')}%`);
    }
    conditions.push(`(${originConditions.join(" OR ")})`);
  }

  const destinationArr = toArray(destination);
  if (destinationArr.length) {
    const normalizedDestinations = destinationArr.map(normalizeWilaya);
    const destConditions = [];
    for (let i = 0; i < normalizedDestinations.length; i++) {
      destConditions.push(`LOWER(REGEXP_REPLACE(destination, '[^a-zA-Z0-9]', '', 'g')) LIKE $${values.length + 1}`);
      values.push(`%${normalizedDestinations[i].replace(/[^a-zA-Z0-9]/g, '')}%`);
    }

    for (let i = 0; i < normalizedDestinations.length; i++) {
      destConditions.push(`EXISTS (
        SELECT 1 FROM jsonb_array_elements_text(COALESCE(transit_cities, '[]'::jsonb)) AS transit_city
        WHERE LOWER(REGEXP_REPLACE(transit_city, '[^a-zA-Z0-9]', '', 'g')) LIKE $${values.length + 1}
      )`);
      values.push(`%${normalizedDestinations[i].replace(/[^a-zA-Z0-9]/g, '')}%`);
    }
    conditions.push(`(${destConditions.join(" OR ")})`);
  }

const parseDateValue = (value) => {
  if (!value) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  if (value.includes('/')) {
    const parts = value.split('/');
    if (parts.length === 3) {
      return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
    }
  }
  return null;
};

  if (start_date && start_date !== "" && (!end_date || end_date === "")) {
    const parsedStart = parseDateValue(start_date);
    if (parsedStart) {
      values.push(parsedStart);
      conditions.push(`departure_date::date >= $${values.length}::date`);
    }
  }

  else if (end_date && end_date !== "" && (!start_date || start_date === "")) {
    const parsedEnd = parseDateValue(end_date);
    if (parsedEnd) {
      values.push(parsedEnd);
      conditions.push(`departure_date::date <= $${values.length}::date`);
    }
  }

  else if (start_date && start_date !== "" && end_date && end_date !== "") {
    const parsedStart = parseDateValue(start_date);
    const parsedEnd = parseDateValue(end_date);
    if (parsedStart && parsedEnd) {
      values.push(parsedStart);
      values.push(parsedEnd);
      conditions.push(
        `departure_date::date >= $${values.length - 1}::date AND departure_date::date <= $${values.length}::date AND (end_date IS NULL OR end_date::date <= $${values.length}::date)`
      );
    }
  }

  if (weightMin !== undefined && weightMin !== "" && weightMin !== null && Number(weightMin) > 0) {
    values.push(Number(weightMin));
    conditions.push(`max_weight >= $${values.length}`);
  }

  if (weightMax !== undefined && weightMax !== "" && weightMax !== null && Number(weightMax) < 999) {
    values.push(Number(weightMax));
    conditions.push(`max_weight <= $${values.length}`);
  }

  if (volumeMin !== undefined && volumeMin !== "" && volumeMin !== null && Number(volumeMin) > 0) {
    values.push(Number(volumeMin));
    conditions.push(`max_volume >= $${values.length}`);
  }

  if (volumeMax !== undefined && volumeMax !== "" && volumeMax !== null && Number(volumeMax) < 999) {
    values.push(Number(volumeMax));
    conditions.push(`max_volume <= $${values.length}`);
  }

  const truckTypesArr = toArray(truckTypes)
    .map(t => String(t).trim().toUpperCase())
    .filter(Boolean);

  if (truckTypesArr.length > 0) {
    const typeConditions = truckTypesArr.map(type => {
      values.push(type);
      return `routes.truck_type = $${values.length}`;
    });
    conditions.push(`(${typeConditions.join(" OR ")})`);
  }

  if (route_type && route_type !== "") {
    let mappedType = route_type;
    if (route_type === "aller") mappedType = "ONE_WAY";
    if (route_type === "aller-retour") mappedType = "ROUND_TRIP";
    if (mappedType === "ONE_WAY" || mappedType === "ROUND_TRIP") {
      values.push(mappedType);
      conditions.push(`route_type = $${values.length}`);
    }
  }

  const sortMap = {
    Newest: "routes.created_at DESC",
    Oldest: "routes.created_at ASC",
    "Weight ↑": "routes.max_weight ASC NULLS LAST",
    "Weight ↓": "routes.max_weight DESC NULLS LAST",
    "Volume ↑": "routes.max_volume ASC NULLS LAST",
    "Volume ↓": "routes.max_volume DESC NULLS LAST",
  };
  const orderBy = sortMap[sortBy] || "routes.created_at DESC";

  let sql = `
    SELECT routes.*, u.business_name as company, u.email as user_email,
           t.truck_pictures
    FROM routes
    LEFT JOIN users u ON u.id = routes.posted_by
    LEFT JOIN trucks t ON t.id = routes.assigned_truck_id
  `;

  if (conditions.length) {
    sql += " WHERE " + conditions.join(" AND ");
  }

  const currentPage = Math.max(1, parseInt(page) || 1);
  const perPage = Math.max(1, parseInt(limit) || 20);
  const offset = (currentPage - 1) * perPage;

  let countSql = `SELECT COUNT(*) FROM routes LEFT JOIN users u ON u.id = routes.posted_by`;
  if (conditions.length) countSql += " WHERE " + conditions.join(" AND ");

  try {
    const countResult = await pool.query(countSql, values);
    const totalCount = parseInt(countResult.rows[0].count);
    const totalPages = Math.ceil(totalCount / perPage);

    values.push(perPage);
    values.push(offset);
    sql += ` ORDER BY ${orderBy} LIMIT $${values.length - 1} OFFSET $${values.length}`;

    const result = await pool.query(sql, values);
    res.status(200).json({
      routes: result.rows,
      pagination: {
        total: totalCount,
        total_pages: totalPages,
        current_page: currentPage,
        limit: perPage,
      },
    });
  } catch (error) {
    console.error("Error fetching routes:", error);
    res.status(500).json({ message: "Error fetching routes" });
  }
};

export const getAllMyRoutes = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM routes WHERE posted_by = $1 ORDER BY created_at DESC",
      [req.user.id]
    );
    res.status(200).json({ routes: result.rows });
  } catch (error) {
    console.error("Error fetching my routes:", error);
    res.status(500).json({ message: "Error fetching my routes" });
  }
};

export const getMyRoutesCount = async (req, res) => {
  try {
    const result = await pool.query("SELECT COUNT(*)::int AS total FROM routes WHERE posted_by = $1", [req.user.id]);
    res.status(200).json({ total: result.rows[0].total });
  } catch (error) {
    console.error("Error counting routes:", error);
    res.status(500).json({ message: "Error counting routes" });
  }
};

export const getRouteShipments = async (req, res) => {
  const { id } = req.params;
  try {
    const routeRes = await pool.query("SELECT * FROM routes WHERE id = $1", [id]);
    if (routeRes.rows.length === 0) return res.status(404).json({ message: "Route not found" });
    const route = routeRes.rows[0];

    let canAccess = req.user.user_type === "admin" || route.posted_by === req.user.id;
    if (!canAccess && route.assigned_truck_id !== null) {
      const truckRes = await pool.query("SELECT created_by FROM trucks WHERE id = $1", [route.assigned_truck_id]);
      if (truckRes.rows.length > 0 && truckRes.rows[0].created_by === req.user.id) canAccess = true;
    }
    if (!canAccess) return res.status(403).json({ message: "Forbidden" });

    const result = await pool.query(
      `SELECT s.*, a.status AS assignment_status, a.created_at AS assigned_at,
              u.business_name AS carrier_name
       FROM assignments a
       JOIN shipments s ON s.id = a.shipment_id
       LEFT JOIN trucks t ON t.id = a.truck_id
       LEFT JOIN users u ON u.id = t.created_by
       WHERE a.route_id = $1 AND a.shipment_id IS NOT NULL
       ORDER BY a.id DESC`,
      [id]
    );
    res.status(200).json({ shipments: result.rows });
  } catch (error) {
    console.error("Error fetching route shipments:", error);
    res.status(500).json({ message: "Error fetching route shipments" });
  }
};

export const markShipmentPickedUp = async (req, res) => {
  const { id: routeId, shipmentId } = req.params;
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const routeRes = await client.query("SELECT * FROM routes WHERE id = $1", [routeId]);
    if (routeRes.rows.length === 0) { await client.query("ROLLBACK"); return res.status(404).json({ message: "Route not found" }); }
    const route = routeRes.rows[0];

    let canAccess = req.user.user_type === "admin" || route.posted_by === req.user.id;
    if (!canAccess && route.assigned_truck_id !== null) {
      const truckRes = await client.query("SELECT created_by FROM trucks WHERE id = $1", [route.assigned_truck_id]);
      if (truckRes.rows.length > 0 && truckRes.rows[0].created_by === req.user.id) canAccess = true;
    }
    if (!canAccess) { await client.query("ROLLBACK"); return res.status(403).json({ message: "Forbidden" }); }

    const assignmentRes = await client.query(
      "SELECT * FROM assignments WHERE route_id = $1 AND shipment_id = $2 FOR UPDATE",
      [routeId, shipmentId]
    );
    if (assignmentRes.rows.length === 0) { await client.query("ROLLBACK"); return res.status(404).json({ message: "Assignment not found" }); }

    await client.query("UPDATE assignments SET status = $1 WHERE id = $2", ["picked_up", assignmentRes.rows[0].id]);
    await client.query("UPDATE shipments SET status = $1 WHERE id = $2", ["picked_up", shipmentId]);
    await client.query("COMMIT");
    res.status(200).json({ message: "Shipment marked as picked up" });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error marking shipment picked up:", error);
    res.status(500).json({ message: "Error updating assignment status" });
  } finally {
    client.release();
  }
};

export const deleteRoute = async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ message: "route id required" });

  try {
    const routeRes = await pool.query("SELECT posted_by FROM routes WHERE id = $1", [id]);
    if (routeRes.rows.length === 0) return res.status(404).json({ message: "Route not found" });
    if (req.user.user_type !== "admin" && routeRes.rows[0].posted_by !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const activeAssignment = await pool.query(
      "SELECT id FROM assignments WHERE route_id = $1 AND status NOT IN ('cancelled','delivered') LIMIT 1",
      [id]
    );
    if (req.user.user_type !== "admin" && activeAssignment.rows.length > 0) {
      return res.status(409).json({ message: "Cannot delete a route with active shipment assignments" });
    }

    await pool.query("UPDATE assignments SET status = 'cancelled' WHERE route_id = $1", [id]);

    await pool.query(
      "UPDATE shipments SET status = 'posted' WHERE id IN (SELECT shipment_id FROM assignments WHERE route_id = $1)",
      [id]
    );

    await pool.query("DELETE FROM routes WHERE id = $1", [id]);
    return res.status(200).json({ message: "Route deleted successfully" });
  } catch (error) {
    console.error("Error deleting route:", error);
    return res.status(500).json({ message: "Error deleting route" });
  }
};

export const updateRoute = async (req, res) => {
  const { id } = req.params;
  const { origin, destination, transit_cities, departure_date, end_date,
    max_weight, max_volume, phonecountrycode, contact_phone, notes,
    assigned_truck_id, truck_type, route_type } = req.body;

  try {
    const row = await pool.query("SELECT posted_by FROM routes WHERE id = $1", [id]);
    if (row.rows.length === 0) return res.status(404).json({ message: "Route not found" });
    if (req.user.user_type !== "admin" && row.rows[0].posted_by !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const updates = [];
    const values = [];
    if (origin !== undefined) { values.push(origin); updates.push(`origin = $${values.length}`); }
    if (destination !== undefined) { values.push(destination); updates.push(`destination = $${values.length}`); }
    if (transit_cities !== undefined) { values.push(JSON.stringify(transit_cities || [])); updates.push(`transit_cities = $${values.length}::jsonb`); }
    if (departure_date !== undefined) { values.push(departure_date); updates.push(`departure_date = $${values.length}`); }
    if (end_date !== undefined) { values.push(end_date); updates.push(`end_date = $${values.length}`); }
    if (max_weight !== undefined) { values.push(max_weight); updates.push(`max_weight = $${values.length}`); }
    if (max_volume !== undefined) { values.push(max_volume); updates.push(`max_volume = $${values.length}`); }
    if (phonecountrycode !== undefined) { values.push(phonecountrycode); updates.push(`phone_country_code = $${values.length}`); }
    if (contact_phone !== undefined) { values.push(contact_phone); updates.push(`contact_phone = $${values.length}`); }
    if (notes !== undefined) { values.push(notes); updates.push(`notes = $${values.length}`); }
    if (assigned_truck_id !== undefined) { values.push(assigned_truck_id); updates.push(`assigned_truck_id = $${values.length}`); }
    if (truck_type !== undefined) { values.push(truck_type); updates.push(`truck_type = $${values.length}`); }
    if (route_type !== undefined) { values.push(route_type); updates.push(`route_type = $${values.length}`); }

    if (updates.length === 0) return res.status(400).json({ message: "No fields provided to update" });
    values.push(id);
    const result = await pool.query(`UPDATE routes SET ${updates.join(", ")} WHERE id = $${values.length} RETURNING *`, values);
    res.status(200).json({ route: result.rows[0] });
  } catch (error) {
    console.error("Error updating route:", error);
    res.status(500).json({ message: "Error updating route" });
  }
};

export const assignShipment = async (req, res) => {
  const { id: routeId } = req.params;
  const { shipment_id } = req.body;
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const routeRes = await client.query("SELECT * FROM routes WHERE id = $1 FOR UPDATE", [routeId]);
    if (routeRes.rows.length === 0) { await client.query("ROLLBACK"); return res.status(404).json({ message: "Route not found" }); }
    const route = routeRes.rows[0];
    if (req.user.user_type !== "admin" && route.posted_by !== req.user.id) {
      await client.query("ROLLBACK"); return res.status(403).json({ message: "Forbidden" });
    }
    if (route.assigned_truck_id === null) { await client.query("ROLLBACK"); return res.status(400).json({ message: "Route truck not assigned" }); }

    const shipmentRes = await client.query("SELECT * FROM shipments WHERE id = $1 FOR UPDATE", [shipment_id]);
    if (shipmentRes.rows.length === 0) { await client.query("ROLLBACK"); return res.status(404).json({ message: "Shipment not found" }); }
    const shipment = shipmentRes.rows[0];

    const existingAssignmentRes = await client.query(
      `SELECT a.id FROM assignments a
       JOIN routes r ON r.id = a.route_id
       WHERE a.shipment_id = $1 AND a.status != 'cancelled'`,
      [shipment_id]
    );
    if (existingAssignmentRes.rows.length > 0) { await client.query("ROLLBACK"); return res.status(409).json({ message: "Shipment already assigned" }); }

    const capacityRes = await client.query(
      `SELECT COALESCE(SUM(s.weight), 0) AS used_weight, COALESCE(SUM(s.volume), 0) AS used_volume
       FROM assignments a JOIN shipments s ON s.id = a.shipment_id
       WHERE a.route_id = $1 AND a.status != 'cancelled'`,
      [routeId]
    );
    const usedWeight = parseFloat(capacityRes.rows[0].used_weight) || 0;
    const usedVolume = parseFloat(capacityRes.rows[0].used_volume) || 0;
    const shipWeight = parseFloat(shipment.weight) || 0;
    const shipVolume = parseFloat(shipment.volume) || 0;
    const maxWeight = parseFloat(route.max_weight) || Infinity;
    const maxVolume = parseFloat(route.max_volume) || Infinity;

    if (usedWeight + shipWeight > maxWeight) { await client.query("ROLLBACK"); return res.status(409).json({ message: `Not enough weight capacity. Available: ${maxWeight - usedWeight} t` }); }
    if (usedVolume + shipVolume > maxVolume) { await client.query("ROLLBACK"); return res.status(409).json({ message: `Not enough volume capacity. Available: ${maxVolume - usedVolume} m³` }); }

    await client.query("INSERT INTO assignments (shipment_id, route_id, truck_id, status) VALUES ($1, $2, $3, $4)", [shipment_id, routeId, route.assigned_truck_id, "assigned"]);
    await client.query("UPDATE shipments SET status = $1 WHERE id = $2", ["assigned", shipment_id]);

    const reseruerRes = await client.query("SELECT id, business_name, phone_number FROM users WHERE id = $1", [req.user.id]);
    const reserver = reseruerRes.rows[0] || {};

    if (shipment.created_by !== req.user.id) {
      const notificationMessage = `Your shipment "${shipment.title}" has been reserved by ${reserver.business_name || "a transporter"}`;
      await client.query(
        `INSERT INTO notifications (user_id, title, message, type, meta)
         VALUES ($1, $2, $3, $4, $5)`,
        [
          shipment.created_by,
          "Shipment Reserved",
          notificationMessage,
          "success",
          JSON.stringify({
            shipment_id: shipment.id,
            route_id: routeId,
            reserver_name: reserver.business_name,
            reserver_phone: reserver.phone_number,
            action: "shipment_reserved"
          })
        ]
      );
    }

    if (route.posted_by !== req.user.id && route.posted_by !== shipment.created_by) {
      await client.query(
        `INSERT INTO notifications (user_id, title, message, type, meta)
         VALUES ($1, $2, $3, $4, $5)`,
        [
          route.posted_by,
          "Shipment Assigned to Route",
          `Shipment "${shipment.title}" has been assigned to your route from ${route.origin} to ${route.destination}`,
          "info",
          JSON.stringify({
            shipment_id: shipment.id,
            route_id: routeId,
            action: "shipment_assigned_to_route"
          })
        ]
      );
    }

    await client.query("COMMIT");
    res.status(201).json({ message: "Shipment assigned successfully" });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error assigning shipment:", error);
    res.status(500).json({ message: "Error assigning shipment" });
  } finally {
    client.release();
  }
};

export const updateRouteShipmentLocations = async (req, res) => {
  const { id } = req.params;
  const { current_lat, current_lng } = req.body;
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const routeRes = await client.query("SELECT * FROM routes WHERE id = $1", [id]);
    if (routeRes.rows.length === 0) { await client.query("ROLLBACK"); return res.status(404).json({ message: "Route not found" }); }
    const route = routeRes.rows[0];

    let canAccess = req.user.user_type === "admin" || route.posted_by === req.user.id;
    if (!canAccess && route.assigned_truck_id !== null) {
      const truckRes = await client.query("SELECT created_by FROM trucks WHERE id = $1", [route.assigned_truck_id]);
      if (truckRes.rows.length > 0 && truckRes.rows[0].created_by === req.user.id) canAccess = true;
    }
    if (!canAccess) { await client.query("ROLLBACK"); return res.status(403).json({ message: "Forbidden" }); }

    await client.query(
      `UPDATE shipments SET current_lat = $1, current_lng = $2
       WHERE id IN (SELECT shipment_id FROM assignments WHERE route_id = $3 AND status IN ('picked_up', 'in_transit'))`,
      [current_lat, current_lng, id]
    );
    await client.query("COMMIT");
    res.status(200).json({ message: "Shipment locations updated successfully" });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error updating locations:", error);
    res.status(500).json({ message: "Error updating shipment locations" });
  } finally {
    client.release();
  }
};

export const cancelAssignment = async (req, res) => {
  const { id: routeId, assignmentId } = req.params;
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const routeRes = await client.query("SELECT posted_by FROM routes WHERE id = $1", [routeId]);
    if (routeRes.rows.length === 0) { await client.query("ROLLBACK"); return res.status(404).json({ message: "Route not found" }); }
    if (req.user.user_type !== "admin" && routeRes.rows[0].posted_by !== req.user.id) {
      await client.query("ROLLBACK"); return res.status(403).json({ message: "Forbidden" });
    }

    const assignRes = await client.query("SELECT * FROM assignments WHERE id = $1 AND route_id = $2", [assignmentId, routeId]);
    if (assignRes.rows.length === 0) { await client.query("ROLLBACK"); return res.status(404).json({ message: "Assignment not found" }); }
    if (assignRes.rows[0].status === "cancelled" || assignRes.rows[0].status === "delivered") {
      await client.query("ROLLBACK"); return res.status(409).json({ message: "Cannot cancel this assignment" });
    }

    await client.query("UPDATE assignments SET status = 'cancelled' WHERE id = $1", [assignmentId]);
    await client.query("UPDATE shipments SET status = 'posted' WHERE id = $1", [assignRes.rows[0].shipment_id]);
    await client.query("COMMIT");
    res.status(200).json({ message: "Assignment cancelled successfully" });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error cancelling assignment:", error);
    res.status(500).json({ message: "Error cancelling assignment" });
  } finally {
    client.release();
  }
};

export const updateRouteStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const VALID_STATUSES = ['open', 'in_transit', 'completed', 'cancelled'];
  if (!status || !VALID_STATUSES.includes(status)) {
    return res.status(400).json({ message: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}` });
  }
  try {
    const result = await pool.query(`UPDATE routes SET status = $1 WHERE id = $2 AND posted_by = $3 RETURNING *`, [status, id, req.user.id]);
    if (result.rows.length === 0) return res.status(404).json({ message: "Route not found or not yours" });
    res.status(200).json({ message: "Status updated", route: result.rows[0] });
  } catch (error) {
    console.error("Error updating route status:", error);
    res.status(500).json({ message: "Error updating route status" });
  }
};