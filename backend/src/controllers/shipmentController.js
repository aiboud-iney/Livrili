import pool from "../config/db.js";
import path from "path";

export const createShipment = async (req, res) => {
  const {
    title, origin, destination,
    from_pickup_date, to_pickup_date, weight, volume, phone_number,
    description, shipment_type, truck_type,
  } = req.body;

  const status = "posted";
  const userId = req.user.id;

  try {
    const subQuery = `
      SELECT us.id FROM user_subscriptions us
      JOIN plans p ON us.plan_id = p.id
      WHERE us.user_id = $1 AND us.status = 'active' AND p.is_premium = true
      AND (us.end_date IS NULL OR us.end_date > NOW()) LIMIT 1
    `;
    const subResult = await pool.query(subQuery, [userId]);
    const hasPremium = subResult.rowCount > 0;

    if (!hasPremium) {
      const countQuery = `
        SELECT (SELECT COUNT(*) FROM shipments WHERE created_by = $1) +
               (SELECT COUNT(*) FROM routes WHERE posted_by = $1) AS total_count
      `;
      const countResult = await pool.query(countQuery, [userId]);
      const totalCount = parseInt(countResult.rows[0].total_count, 10);
      if (totalCount >= 5) {
        return res.status(403).json({
          message: "FREE_LIMIT_REACHED",
          error: "Free plan users can only post a combined maximum of 5 shipments and routes.",
        });
      }
    }

    const shipmentPictures = req.files
      ? req.files.map(file => `${req.protocol}://${req.get("host")}/uploads/` + path.basename(file.path))
      : [];

    const parsedWeight = weight ? parseFloat(weight) : null;
    const parsedVolume = volume ? parseFloat(volume) : null;

    const query = `
      INSERT INTO shipments (title, origin, destination,
        from_pickup_date, to_pickup_date, weight, volume, phone_number, status,
        created_by, shipment_pictures, description, shipment_type, truck_type)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *
    `;

    const values = [
      title || null, origin, destination,
      from_pickup_date, to_pickup_date, parsedWeight, parsedVolume,
      phone_number, status, userId, shipmentPictures,
      description ?? null, shipment_type || null, truck_type || null,
    ];

    const result = await pool.query(query, values);
    res.status(201).json({ shipment: result.rows[0] });
  } catch (error) {
    console.error("Error creating shipment:", error);
    res.status(500).json({ message: "Error creating shipment", error: error.message });
  }
};

export const getShipment = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(`
      SELECT
        s.id,
        s.title,
        s.origin,
        s.destination,
        s.from_pickup_date,
        s.to_pickup_date,
        s.weight,
        s.volume,
        s.phone_number,
        s.description,
        s.shipment_pictures,
        s.status,
        s.shipment_type,
        s.truck_type,
        s.created_at,
        s.created_by,
        COALESCE(u.business_name, 'Unknown Company') as business_name,
        COALESCE(u.email, '') as email,
        COALESCE(u.phone_number, 'Not provided') as user_phone
      FROM shipments s
      LEFT JOIN users u ON s.created_by = u.id
      WHERE s.id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Shipment not found" });
    }

    const row = result.rows[0];

    res.status(200).json({
      shipment: {
        id: row.id,
        title: row.title,
        origin: row.origin,
        destination: row.destination,
        from_pickup_date: row.from_pickup_date,
        to_pickup_date: row.to_pickup_date,
        weight: row.weight,
        volume: row.volume,
        phone_number: row.phone_number,
        description: row.description,
        shipment_pictures: row.shipment_pictures || [],
        status: row.status,
        shipment_type: row.shipment_type,
        truck_type: row.truck_type,
        created_at: row.created_at,
        created_by: row.created_by,
        business_name: row.business_name,
        email: row.email,
        user_phone: row.user_phone
      }
    });
  } catch (error) {
    console.error(" Error fetching shipment:", error);
    res.status(500).json({ message: "Error fetching shipment", error: error.message });
  }
};

export const updateShipment = async (req, res) => {
  const { id } = req.params;
  const { title, origin, destination,
    from_pickup_date, to_pickup_date, weight, volume, phone_number,
    status, truck_type, shipment_type, description } = req.body;

  try {
    const shipmentRes = await pool.query("SELECT * FROM shipments WHERE id = $1", [id]);
    if (shipmentRes.rows.length === 0) return res.status(404).json({ message: "Shipment not found" });
    const shipment = shipmentRes.rows[0];
    if (req.user.user_type !== "admin" && req.user.id !== shipment.created_by) {
      return res.status(403).json({ message: "Forbidden" });
    }
    if (shipment.status !== "posted" && req.user.user_type !== "admin") {
      return res.status(409).json({ message: "Cannot edit a shipment that is already assigned or in transit" });
    }

    const query = `
      UPDATE shipments SET
        title = $1, origin = $2, destination = $3,
        from_pickup_date = $4, to_pickup_date = $5,
        weight = $6, volume = $7, phone_number = $8,
        status = $9, truck_type = $10, shipment_type = $11, description = $12
      WHERE id = $13
      RETURNING *
    `;
    const values = [
      title || shipment.title, origin || shipment.origin, destination || shipment.destination,
      from_pickup_date || shipment.from_pickup_date, to_pickup_date || shipment.to_pickup_date,
      weight || shipment.weight, volume || shipment.volume, phone_number || shipment.phone_number,
      status || shipment.status, truck_type || shipment.truck_type,
      shipment_type || shipment.shipment_type, description !== undefined ? description : shipment.description, id
    ];
    const result = await pool.query(query, values);
    res.status(200).json({ shipment: result.rows[0] });
  } catch (error) {
    console.error("Error updating shipment:", error);
    res.status(500).json({ message: "Error updating shipment" });
  }
};

export const deleteShipment = async (req, res) => {
  const { id } = req.params;
  try {
    const shipmentRes = await pool.query("SELECT * FROM shipments WHERE id = $1", [id]);
    if (shipmentRes.rows.length === 0) return res.status(404).json({ message: "Shipment not found" });
    if (req.user.user_type !== "admin" && req.user.id !== shipmentRes.rows[0].created_by) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const activeAssignment = await pool.query(
      "SELECT id FROM assignments WHERE shipment_id = $1 AND status NOT IN ('cancelled','delivered') LIMIT 1",
      [id]
    );
    if (req.user.user_type !== "admin" && activeAssignment.rows.length > 0) {
        return res.status(409).json({ message: "Cannot delete a shipment that is currently assigned to a route" });
    }
    await pool.query("DELETE FROM shipments WHERE id = $1", [id]);
    res.status(200).json({ message: "Shipment deleted successfully" });
  } catch (error) {
    console.error("Error deleting shipment:", error);
    res.status(500).json({ message: "Error deleting shipment" });
  }
};

export const getAllShipments = async (req, res) => {
  const {
    origin,
    destination,
    start_date,
    end_date,
    weightMin,
    weightMax,
    volumeMin,
    volumeMax,
    page,
    limit,
    sortBy,
    shipmentTypes,
    truckTypes,
    userSearch,
  } = req.query;

  const normalizeWilaya = (value) => {
    if (!value) return "";
    return String(value)
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();
  };

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

  try {
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
        WHERE u.id = shipments.created_by
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
      conditions.push(`(${destConditions.join(" OR ")})`);
    }

    const parsedStartDate = parseDateValue(start_date);
    const parsedEndDate = parseDateValue(end_date);

    if (parsedStartDate && !parsedEndDate) {
      values.push(parsedStartDate);

      conditions.push(`from_pickup_date::date >= $${values.length}::date`);
    }
    else if (parsedEndDate && !parsedStartDate) {
      values.push(parsedEndDate);

      conditions.push(`from_pickup_date::date <= $${values.length}::date`);
    }
    else if (parsedStartDate && parsedEndDate) {
      values.push(parsedStartDate);
      values.push(parsedEndDate);

      conditions.push(`from_pickup_date::date >= $${values.length - 1}::date AND to_pickup_date::date <= $${values.length}::date`);
    }

    if (weightMin !== undefined && weightMin !== "" && weightMin !== null && Number(weightMin) > 0) {
      values.push(Number(weightMin));
      conditions.push(`weight >= $${values.length}`);
    }

    if (weightMax !== undefined && weightMax !== "" && weightMax !== null && Number(weightMax) < 999) {
      values.push(Number(weightMax));
      conditions.push(`weight <= $${values.length}`);
    }

    if (volumeMin !== undefined && volumeMin !== "" && volumeMin !== null && Number(volumeMin) > 0) {
      values.push(Number(volumeMin));
      conditions.push(`volume >= $${values.length}`);
    }

    if (volumeMax !== undefined && volumeMax !== "" && volumeMax !== null && Number(volumeMax) < 999) {
      values.push(Number(volumeMax));
      conditions.push(`volume <= $${values.length}`);
    }

    const validShipmentTypes = [
      'GENERAL_CARGO', 'PALLETIZED', 'PACKAGED', 'LOOSE_CARGO',
      'REFRIGERATED', 'FROZEN', 'DRY_FOOD', 'BEVERAGES', 'LIVESTOCK',
      'RAW_MATERIALS', 'STEEL_METAL', 'CHEMICALS', 'HAZARDOUS', 'CONSTRUCTION', 'MACHINERY',
      'OVERSIZE', 'HEAVY_LIFT', 'VEHICLES', 'FRAGILE', 'MEDICAL', 'ELECTRONICS',
      'DRY_BULK', 'LIQUID_BULK', 'AGRICULTURAL_BULK'
    ];
    const shipmentTypesArr = toArray(shipmentTypes);
    if (shipmentTypesArr.length > 0) {
      const validTypes = shipmentTypesArr.filter(type => validShipmentTypes.includes(type));
      if (validTypes.length > 0) {
        const typeConditions = validTypes.map(type => {
          values.push(type);
          return `shipment_type = $${values.length}`;
        });
        conditions.push(`(${typeConditions.join(" OR ")})`);
      }
    }

    const truckTypesArr = toArray(truckTypes)
      .map(t => String(t).trim().toUpperCase())
      .filter(Boolean);

    if (truckTypesArr.length > 0) {
      const typeConditions = truckTypesArr.map(type => {
        values.push(type);
        return `truck_type = $${values.length}`;
      });
      conditions.push(`(${typeConditions.join(" OR ")})`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const parsedPage = Math.max(1, parseInt(page) || 1);
    const parsedLimit = Math.max(1, parseInt(limit) || 20);
    const offset = (parsedPage - 1) * parsedLimit;

    let countSql = `SELECT COUNT(*) FROM shipments LEFT JOIN users u ON u.id = shipments.created_by ${whereClause}`;
    const countResult = await pool.query(countSql, values);
    const totalCount = parseInt(countResult.rows[0].count);
    const totalPages = Math.ceil(totalCount / parsedLimit);

    const sortMap = {
      Newest: "shipments.created_at DESC",
      Oldest: "shipments.created_at ASC",
      "Weight ↑": "shipments.weight ASC NULLS LAST",
      "Weight ↓": "shipments.weight DESC NULLS LAST",
      "Volume ↑": "shipments.volume ASC NULLS LAST",
      "Volume ↓": "shipments.volume DESC NULLS LAST",
    };
    const orderBy = sortMap[sortBy] || "shipments.created_at DESC";

    const mainValues = [...values];
    mainValues.push(parsedLimit);
    mainValues.push(offset);

    const result = await pool.query(
      `SELECT
         shipments.id,
         shipments.title,
         shipments.origin,
         shipments.destination,
         shipments.from_pickup_date,
         shipments.to_pickup_date,
         shipments.weight,
         shipments.volume,
         shipments.phone_number,
         shipments.description,
         shipments.shipment_pictures,
         shipments.status,
         shipments.shipment_type,
         shipments.truck_type,
         shipments.created_at,
         shipments.created_by,
         COALESCE(u.business_name, 'Unknown Company') as company,
         COALESCE(u.email, '') as user_email
       FROM shipments
       LEFT JOIN users u ON u.id = shipments.created_by
       ${whereClause}
       ORDER BY ${orderBy}
       LIMIT $${mainValues.length - 1} OFFSET $${mainValues.length}`,
      mainValues
    );

    res.status(200).json({
      shipments: result.rows,
      pagination: {
        total: totalCount,
        total_pages: totalPages,
        current_page: parsedPage,
        limit: parsedLimit,
      },
    });
  } catch (error) {
    console.error("Error fetching shipments:", error);
    res.status(500).json({ message: "Error fetching shipments", error: error.message });
  }
};

export const getAllMyShipments = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT * FROM shipments WHERE created_by = $1 ORDER BY created_at DESC
    `, [req.user.id]);
    res.status(200).json({ shipments: result.rows });
  } catch (error) {
    console.error("Error fetching shipments:", error);
    res.status(500).json({ message: "Error fetching shipments" });
  }
};

export const getMyShipmentsCount = async (req, res) => {
  try {
    const result = await pool.query("SELECT COUNT(*)::int AS total FROM shipments WHERE created_by = $1", [req.user.id]);
    res.status(200).json({ total: result.rows[0].total });
  } catch (error) {
    console.error("Error counting shipments:", error);
    res.status(500).json({ message: "Error counting shipments" });
  }
};

export const getOriginShipments = async (req, res) => {
  const { origin } = req.params;
  try {
    const result = await pool.query("SELECT * FROM shipments WHERE origin = $1 ORDER BY created_at DESC", [origin]);
    res.status(200).json({ shipments: result.rows });
  } catch (error) {
    console.error("Error fetching shipments by origin:", error);
    res.status(500).json({ message: "Error fetching shipments" });
  }
};

export const getDestinationShipments = async (req, res) => {
  const { destination } = req.params;
  try {
    const result = await pool.query("SELECT * FROM shipments WHERE destination = $1 ORDER BY created_at DESC", [destination]);
    res.status(200).json({ shipments: result.rows });
  } catch (error) {
    console.error("Error fetching shipments by destination:", error);
    res.status(500).json({ message: "Error fetching shipments" });
  }
};

export const sortByCreationDateAsc = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM shipments ORDER BY created_at ASC");
    res.status(200).json({ shipments: result.rows });
  } catch (error) {
    console.error("Error fetching shipments:", error);
    res.status(500).json({ message: "Error fetching shipments" });
  }
};

export const sortByCreationDateDesc = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM shipments ORDER BY created_at DESC");
    res.status(200).json({ shipments: result.rows });
  } catch (error) {
    console.error("Error fetching shipments:", error);
    res.status(500).json({ message: "Error fetching shipments" });
  }
};

export const updateShipmentStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const VALID_STATUSES = ['posted', 'assigned', 'picked_up', 'in_transit', 'delivered', 'cancelled', 'completed'];
  if (!status || !VALID_STATUSES.includes(status)) {
    return res.status(400).json({ message: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}` });
  }
  try {
    const result = await pool.query(`
      UPDATE shipments SET status = $1
      WHERE id = $2 AND created_by = $3
      RETURNING *
    `, [status, id, req.user.id]);
    if (result.rows.length === 0) return res.status(404).json({ message: "Shipment not found or not yours" });
    res.status(200).json({ message: "Status updated", shipment: result.rows[0] });
  } catch (error) {
    console.error("Error updating shipment status:", error);
    res.status(500).json({ message: "Error updating shipment status" });
  }
};