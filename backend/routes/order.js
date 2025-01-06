const express = require("express");
const pool = require("../config/db"); // Import your PostgreSQL connection pool
const router = express.Router();

router.post("/", async (req, res) => {
  const { products, address_id, payment_method, shipping_fee, total_amount } =
    req.body;

  try {
    // Use pool.query() instead of dbClient.query()
    const orderResult = await pool.query(
      `INSERT INTO orders (address_id, payment_method, shipping_fee, total_amount, created_at)
       VALUES ($1, $2, $3, $4, NOW()) RETURNING order_id`,
      [address_id, payment_method, shipping_fee, total_amount]
    );

    const orderId = orderResult.rows[0].order_id;

    // Save each product in the order
    for (const product of products) {
      const { product_id, quantity } = product;
      await pool.query(
        `INSERT INTO order_items (order_id, product_id, quantity)
         VALUES ($1, $2, $3)`,
        [orderId, product_id, quantity]
      );
    }

    res.status(201).json({ message: "Order placed successfully", orderId });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
