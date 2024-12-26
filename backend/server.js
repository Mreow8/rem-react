const express = require("express");
const cors = require("cors");
const path = require("path");
const { db } = require("./config/db"); // Database connection
const authRoutes = require("./routes/auth"); // Import auth routes

const app = express();
const PORT = process.env.PORT || 3001; // Use environment port or 3001
const CORS_ORIGIN = "https://rem-react.onrender.com"; // Replace with your frontend URL

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

// Mount the auth routes at /api/auth
app.use("/api/auth", authRoutes);

// Test the database connection
db.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("Database connection failed:", err.message);
  } else {
    console.log("Database connection test succeeded:", res.rows[0]);
  }
});

// Serve static files (if needed)
app.use(express.static(path.join(__dirname, "public")));

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
