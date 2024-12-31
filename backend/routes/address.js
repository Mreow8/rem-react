const express = require("express");
const pool = require("../config/db"); // Import your PostgreSQL connection pool
const router = express.Router();

/**
 * Get all addresses for a user
 * GET /api/addresses/:userId
 */
router.get("/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const query = "SELECT * FROM addresses WHERE user_id = $1";
    const { rows } = await pool.query(query, [userId]);

    res.status(200).json({ addresses: rows });
  } catch (error) {
    console.error("Error fetching addresses:", error);
    res.status(500).json({ message: "Failed to fetch addresses." });
  }
});

/**
 * Add a new address
 * POST /api/addresses
 */
router.post("/", async (req, res) => {
  const {
    userId,
    fullName,
    phoneNumber,
    region,
    province,
    city,
    barangay,
    postalCode,
    label,
  } = req.body;

  if (
    !userId ||
    !fullName ||
    !phoneNumber ||
    !region ||
    !province ||
    !city ||
    !barangay ||
    !postalCode
  ) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const query = `
      INSERT INTO addresses (user_id, full_name, phone_number, region, province, city, barangay, postal_code, label)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING id;
    `;
    const values = [
      userId,
      fullName,
      phoneNumber,
      region,
      province,
      city,
      barangay,
      postalCode,
      label || "Home",
    ];
    const { rows } = await pool.query(query, values);

    res
      .status(201)
      .json({ message: "Address added successfully.", addressId: rows[0].id });
  } catch (error) {
    console.error("Error adding address:", error);
    res.status(500).json({ message: "Failed to add address." });
  }
});

/**
 * Update an existing address
 * PUT /api/addresses/:addressId
 */
router.put("/:addressId", async (req, res) => {
  const { addressId } = req.params;
  const {
    fullName,
    phoneNumber,
    region,
    province,
    city,
    barangay,
    postalCode,
    label,
  } = req.body;

  try {
    const query = `
      UPDATE addresses
      SET 
        full_name = $1,
        phone_number = $2,
        region = $3,
        province = $4,
        city = $5,
        barangay = $6,
        postal_code = $7,
        label = $8
      WHERE id = $9
      RETURNING *;
    `;
    const values = [
      fullName,
      phoneNumber,
      region,
      province,
      city,
      barangay,
      postalCode,
      label,
      addressId,
    ];
    const { rowCount } = await pool.query(query, values);

    if (rowCount === 0) {
      return res.status(404).json({ message: "Address not found." });
    }

    res.status(200).json({ message: "Address updated successfully." });
  } catch (error) {
    console.error("Error updating address:", error);
    res.status(500).json({ message: "Failed to update address." });
  }
});

/**
 * Delete an address
 * DELETE /api/addresses/:addressId
 */
router.delete("/:addressId", async (req, res) => {
  const { addressId } = req.params;

  try {
    const query = "DELETE FROM addresses WHERE id = $1 RETURNING *;";
    const { rowCount } = await pool.query(query, [addressId]);

    if (rowCount === 0) {
      return res.status(404).json({ message: "Address not found." });
    }

    res.status(200).json({ message: "Address deleted successfully." });
  } catch (error) {
    console.error("Error deleting address:", error);
    res.status(500).json({ message: "Failed to delete address." });
  }
});

module.exports = router;
