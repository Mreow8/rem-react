const express = require("express");
const cors = require("cors");
const axios = require("axios"); // For making API requests to PayMongo
const path = require("path");
const pool = require("./config/db");
const authRoutes = require("./routes/profile");
const productsRoutes = require("./routes/products");
const sellersRoutes = require("./routes/sellers");
const cartsRoutes = require("./routes/carts");
const addressRoutes = require("./routes/address");
const orderRoutes = require("./routes/order");
const authsRoutes = require("./routes/auth");

const app = express();
const PORT = 3001;
const CORS_ORIGIN = "https://rem-react.onrender.com";
const PAYMONGO_API_KEY = "sk_test_Mis39QoZrL271hGzDmFXB61J"; // Replace with your PayMongo API key

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: CORS_ORIGIN,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Database connection test
pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("Database connection failed:", err.message);
  } else {
    console.log("Database connection test succeeded:", res.rows[0]);
  }
});

// Routes
app.use("/api/profile", authRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/sellers", sellersRoutes);
app.use("/api/cart", cartsRoutes);
app.use("/api/addresses", addressRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/auth", authsRoutes);

// PayMongo Payment Link Endpoint
app.post("/api/create-payment-link", async (req, res) => {
  console.log("Received request body:", req.body); // Log incoming request body

  const { orderId, description } = req.body;

  if (!orderId || !description) {
    console.error("Missing parameters:", { orderId, description });
    return res.status(400).json({ error: "Missing required parameters" });
  }

  try {
    // Query the database to get the order's total amount
    const orderQuery = await pool.query(
      "SELECT total_amount FROM orders WHERE order_id = $1",
      [orderId]
    );

    if (orderQuery.rows.length === 0) {
      console.error("Order not found:", orderId);
      return res.status(404).json({ error: "Order not found" });
    }

    const amount = orderQuery.rows[0].total_amount * 100;

    console.log("Creating payment link with amount:", amount);

    const response = await axios.post(
      "https://api.paymongo.com/v1/links",
      {
        data: {
          attributes: {
            amount,
            description,
          },
        },
      },
      {
        headers: {
          Authorization: `Basic ${Buffer.from(PAYMONGO_API_KEY).toString(
            "base64"
          )}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("PayMongo response:", response.data); // Log PayMongo response

    const paymentLinkUrl = response.data?.data?.attributes?.checkout_url;

    if (paymentLinkUrl) {
      console.log("Payment link created successfully:", paymentLinkUrl);
      res.json({ paymentLinkUrl });
    } else {
      console.error("Payment link URL not found.");
      res.status(500).json({ error: "Payment link URL not found" });
    }
  } catch (err) {
    console.error(
      "Error creating payment link:",
      err.response?.data || err.message
    ); // Log the error message
    res.status(500).json({ error: "Failed to create payment link" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
