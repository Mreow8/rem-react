const express = require("express");
const path = require("path");
const cors = require("cors");
const pool = require("./config/db"); // Import the database connection pool

const app = express();
const PORT = 3001; // Hardcoded port

// Middleware
app.use(
  cors({
    origin: "https://rem-react.onrender.com", // Replace with the URL of your frontend
    methods: ["GET", "POST", "PUT", "DELETE"], // Specify allowed HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // Specify allowed headers
    credentials: true, // Enable sending credentials (cookies, headers)
  })
);
app.use(express.json()); // Parse JSON requests
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data

// Test the database connection
pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("Database connection test failed:", err.message);
  } else {
    console.log("Database connection test succeeded:", res.rows[0]);
  }
});

// API Routes
const productRoutes = require("./routes/products");
app.use("/api/products", productRoutes); // Mount product-related API routes

// Serve static files from the React dist directory
app.use(express.static(path.join(__dirname, "../rem-react/dist")));

// Catch-all handler for serving React app
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../rem-react/dist", "index.html"));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
