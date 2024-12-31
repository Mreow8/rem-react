const express = require("express");
const pool = require("../config/db"); // Import the pool for database interaction
const router = express.Router();

router.get("/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await pool.query(
      "SELECT id, message, is_read, created_at, updated_at FROM notifications WHERE user_id = $1 ORDER BY created_at DESC",
      [userId]
    );

    if (result.rows.length > 0) {
      res.status(200).json(result.rows);
    } else {
      res
        .status(404)
        .json({ message: "No notifications found for this user." });
    }
  } catch (err) {
    console.error("Error fetching notifications:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update notification status to read
router.patch("/:notificationId", async (req, res) => {
  const { notificationId } = req.params;

  try {
    const result = await pool.query(
      "UPDATE notifications SET is_read = TRUE, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING id, message, is_read",
      [notificationId]
    );

    if (result.rows.length > 0) {
      res.status(200).json(result.rows[0]);
    } else {
      res.status(404).json({ message: "Notification not found." });
    }
  } catch (err) {
    console.error("Error updating notification:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
