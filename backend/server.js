const express = require("express");
const cors = require("cors");
const path = require("path");
const paymongo = require("paymongo");
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

// Create PayMongo payment link
app.post("/api/create-payment-link", async (req, res) => {
  const { orderId, amount, description } = req.body;

  if (!orderId || !amount || !description) {
    return res.status(400).json({ error: "Missing required parameters" });
  }

  try {
    paymongo.apiKey = "sk_test_f4HS6zEv2XSaTjYYyagCcUcu"; // Replace with your PayMongo API key

    const paymentLink = await paymongo.paymentLinks.create({
      amount: amount * 100, // Convert PHP to centavos
      description,
      redirect: {
        success: `https://rem-react.onrender.com/success?orderId=${orderId}`,
        failed: `https://rem-react.onrender.com/failed?orderId=${orderId}`,
      },
    });

    res.json({ paymentLinkUrl: paymentLink.data.attributes.url });
  } catch (err) {
    console.error("Error creating payment link:", err);
    res.status(500).json({ error: "Failed to create payment link" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
