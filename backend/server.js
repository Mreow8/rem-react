const express = require("express");
const cors = require("cors");
const path = require("path");
const pool = require("./config/db"); // Correct import for pool

const app = express();
const PORT = process.env.PORT || 3001; // Use environment port or 3001
const CORS_ORIGIN = process.env.CORS_ORIGIN || "https://rem-react.onrender.com"; // Dynamically set CORS origin

// Middleware to parse incoming JSON requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS middleware to handle cross-origin requests
app.use(
  cors({
    origin: CORS_ORIGIN,
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
    credentials: true, // Allow cookies/credentials
  })
);

// Signup Route
app.post("/api/auth/signup", async (req, res) => {
  const { phone, password, username } = req.body;

  if (!phone || !password || !username) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const checkUserQuery = "SELECT * FROM users WHERE username = $1";
    const { rows } = await pool.query(checkUserQuery, [username]);

    if (rows.length > 0) {
      return res.status(409).json({ message: "Username already exists." });
    }

    const insertUserQuery =
      "INSERT INTO users (phone, password, username) VALUES ($1, $2, $3)";
    await pool.query(insertUserQuery, [phone, password, username]);

    res.status(201).json({ message: "User created successfully!" });
  } catch (error) {
    console.error("Error in /signup route:", error.message);
    res.status(500).json({ message: "Internal server error." });
  }
});

// Login Route
app.post("/api/auth/login", async (req, res) => {
  const { identifier, password } = req.body;

  if (!identifier || !password) {
    return res
      .status(400)
      .json({ message: "Username, email, phone, and password are required." });
  }

  try {
    const query = `
      SELECT users.*, sellers.store_name, sellers.store_id
      FROM users
      LEFT JOIN sellers ON users.user_id = sellers.user_id
      WHERE users.username = $1 OR users.email = $1 OR users.phone = $1
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
    res.status(500).json({ message: "Internal server error." });
  }
});

// Test the database connection
pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("Database connection failed:", err.message);
  } else {
    console.log("Database connection test succeeded:", res.rows[0]);
  }
});

// Serve static files (if needed)
app.use(express.static(path.join(__dirname, "build"))); // Serve static React files

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
