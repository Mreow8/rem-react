const express = require("express");
const cors = require("cors");
const path = require("path");
const pool = require("./config/db");
const authRoutes = require("./routes/profile");
const productsRoutes = require("./routes/products");
const sellersRoutes = require("./routes/sellers");
const cartsRoutes = require("./routes/carts");

const app = express();
const PORT = 3001; // Use environment port or 3001
const CORS_ORIGIN = "https://rem-react.onrender.com"; // Dynamically set CORS origin

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

// Test the database connection
pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("Database connection failed:", err.message);
  } else {
    console.log("Database connection test succeeded:", res.rows[0]);
  }
});
app.use("/api/profile", authRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/sellers", sellersRoutes);
app.use("/api/cart", cartsRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
