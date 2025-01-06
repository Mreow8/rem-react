const express = require("express");
const pool = require("../config/db"); // Import your PostgreSQL connection pool
const router = express.Router();

router.post("/", async (req, res) => {
  const { products, address_id, payment_method, shipping_fee, total_amount } =
    req.body;

  try {
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
        `INSERT INTO orders_items (order_id, product_id, quantity)
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

router.get("/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await pool.query(
      `SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC`,
      [userId]
    );

    const orders = result.rows;
    res.json({ orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Error fetching orders" });
  }
});

module.exports = router;
