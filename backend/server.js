const express = require("express");
const cors = require("cors");
const path = require("path");
const paymongo = require("paymongo"); // Import Paymongo
const pool = require("./config/db");
const authRoutes = require("./routes/profile");
const productsRoutes = require("./routes/products");
const sellersRoutes = require("./routes/sellers");
const cartsRoutes = require("./routes/carts");
const addressRoutes = require("./routes/address");
const authsRoutes = require("./routes/auth");
const orderRoutes = require("./routes/auth");

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

// Test the database connection
pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("Database connection failed:", err.message);
  } else {
    console.log("Database connection test succeeded:", res.rows[0]);
  }
});

// Mount the auth routes at /api/auth
app.use("/api/profile", authRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/sellers", sellersRoutes);
app.use("/api/cart", cartsRoutes);
app.use("/api/addresses", addressRoutes);
app.use("/api/orders", orderRoutes);

// Route to create a Paymongo payment link
app.get("/create-payment-link", (req, res) => {
  paymongo.apiKey = "sk_test_f4HS6zEv2XSaTjYYyagCcUcu"; // Replace with your actual secret key

  paymongo.paymentLinks
    .create({
      amount: 1000,
      description: "Payment for Order #1234",
      redirect: {
        success: "https://rem-react.onrender.com/success",
        failed: "https://rem-react.onrender.com/failed",
      },
    })
    .then((paymentLink) => {
      res.json({ paymentLinkUrl: paymentLink.data.attributes.url });
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
