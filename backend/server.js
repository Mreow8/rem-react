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
// API Routes
app.use("/api/products", productRoutes); // Mount product-related API routes
app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
