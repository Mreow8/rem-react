const express = require("express");
const cors = require("cors");
const axios = require("axios"); // Replace `paymongo` with `axios` for official API calls
const path = require("path");
const pool = require("./config/db");
const authRoutes = require("./routes/profile");
const productsRoutes = require("./routes/products");
const sellersRoutes = require("./routes/sellers");
const cartsRoutes = require("./routes/carts");
const addressRoutes = require("./routes/address");
const orderRoutes = require("./routes/order");

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

// PayMongo Payment Link Endpoint
app.post("/api/create-payment-link", async (req, res) => {
  const { orderId, description } = req.body;

  if (!orderId || !description) {
    return res.status(400).json({ error: "Missing required parameters" });
  }

  try {
    // Query the database to get the order's total amount
    const orderQuery = await pool.query(
      "SELECT total_amount FROM orders WHERE order_id = $1",
      [orderId]
    );

    if (orderQuery.rows.length === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    const amount = orderQuery.rows[0].total_amount * 100; // Convert PHP to centavos

    // Create a payment link via the official PayMongo API
    const response = await axios.post(
      "https://api.paymongo.com/v1/links",
      {
        data: {
          attributes: {
            amount,
            description,
            redirect: {
              success: `https://rem-react.onrender.com/success?orderId=${orderId}`,
              failed: `https://rem-react.onrender.com/failed?orderId=${orderId}`,
            },
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

    // Send the generated payment link to the client
    res.json({ paymentLinkUrl: response.data.data.attributes.url });
  } catch (err) {
    console.error(
      "Error creating payment link:",
      err.response?.data || err.message
    );
    res.status(500).json({ error: "Failed to create payment link" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
