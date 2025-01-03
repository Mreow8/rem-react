const express = require("express");
const router = express.Router();
const pool = require("../config/db"); // Importing the pool for database queries

// Placeholder middleware for `authenticateUser`
const authenticateUser = (req, res, next) => {
  // For now, this simply allows requests through
  console.log("Authentication placeholder.");
  next();
};
// Fetch user profile route
router.get("/:userId", authenticateUser, async (req, res) => {
  const { userId } = req.params;

  try {
    // Fetch user data from the database
    const query = "SELECT user_id, phone, email FROM users WHERE user_id = $1";
    const { rows } = await pool.query(query, [userId]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return the user data
    const user = rows[0];
    res.status(200).json({
      message: "User profile retrieved successfully",
      user: {
        userId: user.user_id,
        phoneNumber: user.phone,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update user profile route
router.put("/:userId", authenticateUser, async (req, res) => {
  const { userId } = req.params;
  const { phoneNumber, email } = req.body;

  try {
    const query = "SELECT * FROM users WHERE user_id = $1";
    const { rows } = await pool.query(query, [userId]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user fields
    let updateQuery = "UPDATE users SET ";
    const updateValues = [];
    let valueIndex = 1;

    if (phoneNumber) {
      updateQuery += `phone = $${valueIndex}, `;
      updateValues.push(phoneNumber);
      valueIndex++;
    }
    if (email) {
      updateQuery += `email = $${valueIndex}, `;
      updateValues.push(email);
      valueIndex++;
    }

    updateQuery = updateQuery.slice(0, -2); // Remove trailing comma
    updateQuery += ` WHERE user_id = $${valueIndex} RETURNING *`;
    updateValues.push(userId);

    const updatedUser = await pool.query(updateQuery, updateValues);

    res.status(200).json({
      message: "User profile updated successfully",
      user: updatedUser.rows[0],
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Signup Route
router.post("/signup", async (req, res) => {
  const { phone, password, username } = req.body;

  if (!phone || !password || !username) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const checkUsernameQuery = "SELECT * FROM users WHERE username = $1";
    const { rows: usernameRows } = await pool.query(checkUsernameQuery, [
      username,
    ]);

    const checkPhoneQuery = "SELECT * FROM users WHERE phone = $1";
    const { rows: phoneRows } = await pool.query(checkPhoneQuery, [phone]);

    if (usernameRows.length > 0 && phoneRows.length > 0) {
      return res
        .status(409)
        .json({ message: "Username and Phone number already exist." });
    } else if (usernameRows.length > 0) {
      return res.status(409).json({ message: "Username already exists." });
    } else if (phoneRows.length > 0) {
      return res.status(409).json({ message: "Phone number already exists." });
    }

    const insertUserQuery =
      "INSERT INTO users (phone, password, username) VALUES ($1, $2, $3)";
    await pool.query(insertUserQuery, [phone, password, username]);

    res.status(201).json({ message: "User created successfully!" });
  } catch (error) {
    console.error("Error in /signup route:", error.message);
    res.status(500).json({
      message: "Internal server error.",
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
});

// Login Route
router.post("/login", async (req, res) => {
  const { identifier, password } = req.body;

  if (!identifier || !password) {
    return res
      .status(400)
      .json({ message: "Username, email, phone, and password are required." });
  }

  try {
    const query = `
      SELECT users.*, stores.store_name, stores.store_id
      FROM users
      LEFT JOIN stores ON users.user_id = stores.user_id
      WHERE users.email = $1 OR users.phone = $1
    `;
    const { rows } = await pool.query(query, [identifier]);

    if (rows.length === 0) {
      return res.status(401).json({ message: "User does not exist." });
    }

    const user = rows[0];

    if (user.password !== password) {
      return res.status(401).json({ message: "Incorrect password." });
    }

    res.status(200).json({
      message: "Login successful",
      user_id: user.user_id,
      store_name: user.store_name,
      store_id: user.store_id,
    });
  } catch (error) {
    console.error("Error in /login route:", error.message);
    res.status(500).json({
      message: "Internal server error.",
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
});

module.exports = router;
