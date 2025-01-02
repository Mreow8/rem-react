const express = require("express");
const router = express.Router();
const pool = require("../config/db"); // Importing the pool for database queries
router.put(
  "/:userId",
  authenticateUser,
  [
    // Validation (optional, based on your needs)
    check("phoneNumber")
      .optional()
      .isString()
      .withMessage("Phone number must be a string"),
    check("email").optional().isEmail().withMessage("Invalid email format"),
  ],
  async (req, res) => {
    const { userId } = req.params;
    const { phoneNumber, email } = req.body;

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Find user by userId
    try {
      let user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Only update the fields that are provided
      if (phoneNumber) user.phoneNumber = phoneNumber;
      if (email) user.email = email;

      // Save the updated user information
      await user.save();

      return res.status(200).json({
        message: "User profile updated successfully",
        user,
      });
    } catch (error) {
      console.error("Error updating user:", error);
      return res.status(500).json({ message: "Server error" });
    }
  }
);
router.post("/signup", async (req, res) => {
  const { phone, password, username } = req.body;

  // Check if all fields are provided
  if (!phone || !password || !username) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    // Query to check if the username already exists
    const checkUsernameQuery = "SELECT * FROM users WHERE username = $1";
    const { rows: usernameRows } = await pool.query(checkUsernameQuery, [
      username,
    ]);

    // Query to check if the phone number already exists
    const checkPhoneQuery = "SELECT * FROM users WHERE phone = $1";
    const { rows: phoneRows } = await pool.query(checkPhoneQuery, [phone]);

    // If either username or phone already exists, return a conflict error
    if (usernameRows.length > 0 && phoneRows.length > 0) {
      return res
        .status(409)
        .json({ message: "Username and Phone number already exist." });
    } else if (usernameRows.length > 0) {
      return res.status(409).json({ message: "Username already exists." });
    } else if (phoneRows.length > 0) {
      return res.status(409).json({ message: "Phone number already exists." });
    }

    // Insert new user into the database
    const insertUserQuery =
      "INSERT INTO users (phone, password, username) VALUES ($1, $2, $3)";
    await pool.query(insertUserQuery, [phone, password, username]);

    res.status(201).json({ message: "User created successfully!" });
  } catch (error) {
    console.error("Error in /signup route:", error.message);
    res.status(500).json({
      message: "Internal server error.",
      error: error.message, // Detailed error message for debugging
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined, // Include stack trace in development
    });
  }
});

// Login Route
router.post("/login", async (req, res) => {
  const { identifier, password } = req.body;

  // Validate if both identifier and password are provided
  if (!identifier || !password) {
    return res
      .status(400)
      .json({ message: "Username, email, phone, and password are required." });
  }
  console.log("identifier", identifier);
  try {
    // Query to fetch user details from either username, email, or phone
    const query = `
      SELECT users.*, stores.store_name, stores.store_id
      FROM users
      LEFT JOIN stores ON users.user_id = stores.user_id
      WHERE users.email = $1 OR users.phone = $1
    `;
    const { rows } = await pool.query(query, [identifier]);

    // If user doesn't exist, return an error message
    if (rows.length === 0) {
      return res.status(401).json({ message: "User does not exist." });
    }

    const user = rows[0];

    // Check if the password matches
    if (user.password !== password) {
      return res.status(401).json({ message: "Incorrect password." });
    }

    // Respond with user data on successful login
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
      error: error.message, // Detailed error message for debugging
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined, // Include stack trace in development
    });
  }
});

module.exports = router; // Export the router to be used in server.js
