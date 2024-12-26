const express = require("express");
const path = require("path");
const cors = require("cors");
const pool = require("./config/db"); // Import the database connection pool

const app = express();
const PORT = 3001; // Hardcoded port
const CORS_ORIGIN = "https://rem-react.onrender.com"; // Hardcoded CORS origin

// Import routes
const productRoutes = require("./routes/products");
const authRoutes = require("./routes/auth"); // Import auth routes

app.use(express.json()); // Parse JSON requests
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data

// Middleware
app.use(
  cors({
    origin: CORS_ORIGIN,
    methods: ["GET", "POST", "PUT", "DELETE"], // Specify allowed HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // Specify allowed headers
    credentials: true, // Enable sending credentials (cookies, headers)
  })
);

// Test the database connection
pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("Database connection test failed:", err.message);
  } else {
    console.log("Database connection test succeeded:", res.rows[0]);
  }
});

// Signup Route
app.post("/api/signup", async (req, res) => {
  const { phone, password, username } = req.body;

  if (!phone || !password || !username) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const checkUserQuery = "SELECT * FROM users WHERE username = ?";
    const { rows } = await pool.query(checkUserQuery, [username]);

    if (rows.length > 0) {
      return res.status(409).json({ message: "Username already exists." });
    }

    const insertUserQuery =
      "INSERT INTO users (phone, password, username) VALUES (?, ?, ?)";
    await pool.query(insertUserQuery, [phone, password, username]);

    return res.status(201).json({ message: "User created successfully!" });
  } catch (error) {
    console.error("Error in /signup route:", error.message);
    return res.status(500).json({ message: "Internal server error." });
  }
});

// API Routes
app.use("/api/products", productRoutes); // Mount product-related API routes
app.use("/api/auth", authRoutes);

app.use(express.static(path.join(__dirname, "../frontend/dist")));

// Catch-all handler for serving React app
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist", "index.html"));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
