import pool from "../config/db.js";

export const getMyNotifications = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC",
      [req.user.id],
    );

    res.status(200).json({ notifications: result.rows });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: "Error fetching notifications" });
  }
};

export const getMyNotificationsCount = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT COUNT(*)::int AS total FROM notifications WHERE user_id = $1 AND is_read = false",
      [req.user.id],
    );

    res.status(200).json({ total: result.rows[0].total });
  } catch (error) {
    console.error("Error counting notifications:", error);
    res.status(500).json({ message: "Error counting notifications" });
  }
};

export const markNotificationAsRead = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "UPDATE notifications SET is_read = true WHERE id = $1 AND user_id = $2 RETURNING *",
      [id, req.user.id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.status(200).json({ notification: result.rows[0] });
  } catch (error) {
    console.error("Error updating notification:", error);
    res.status(500).json({ message: "Error updating notification" });
  }
};

export const markAllNotificationsAsRead = async (req, res) => {
  try {
    const result = await pool.query(
      "UPDATE notifications SET is_read = true WHERE user_id = $1 AND is_read = false RETURNING *",
      [req.user.id],
    );

    res.status(200).json({ notifications: result.rows });
  } catch (error) {
    console.error("Error updating notifications:", error);
    res.status(500).json({ message: "Error updating notifications" });
  }
};

export const deleteAllNotifications = async (req, res) => {
  try {
    await pool.query("DELETE FROM notifications WHERE user_id = $1", [req.user.id]);
    res.status(200).json({ message: "All notifications cleared" });
  } catch (error) {
    console.error("Error deleting notifications:", error);
    res.status(500).json({ message: "Error deleting notifications" });
  }
};

export const createNotification = async (
  userId,
  type,
  title,
  message,
  meta = null,
) => {
  const query = `
    INSERT INTO notifications (
      user_id,
      type,
      title,
      message,
      meta,
      is_read
    )
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
  `;

  const values = [userId, type, title, message, meta, false];

  const result = await pool.query(query, values);
  return result.rows[0];
};