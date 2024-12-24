const express = require("express");
const path = require("path");
const cors = require("cors");
const pool = require("./config/db"); // Import the database connection pool

const app = express();
const PORT = 3001; // Hardcoded port

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test the database connection (optional)
pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("Database connection test failed:", err);
  } else {
    console.log("Database connection test succeeded:", res.rows[0]);
  }
});

// Serve static files from the React build directory
app.use(express.static(path.join(__dirname, "../rem-react/build")));

// Catch-all handler for serving React app
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../rem-react/build", "index.html"));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
