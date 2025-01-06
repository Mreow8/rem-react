const express = require("express");
const pool = require("../config/db"); // Import your PostgreSQL connection pool
const router = express.Router();

router.post("/", async (req, res) => {
  const { products, address_id, payment_method, shipping_fee, total_amount } =
    req.body;

  // Validate request body
  if (!products || !Array.isArray(products) || products.length === 0) {
    return res
      .status(400)
      .json({ message: "Products array is required and cannot be empty." });
  }
  if (
    !address_id ||
    !payment_method ||
    shipping_fee === undefined ||
    total_amount === undefined
  ) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  const client = await pool.connect(); // Acquire a client for transaction
  try {
    await client.query("BEGIN"); // Start a transaction

    // Insert order details
    const orderResult = await client.query(
      `INSERT INTO orders (address_id, payment_method, shipping_fee, total_amount, created_at)
       VALUES ($1, $2, $3, $4, NOW()) RETURNING order_id`,
      [address_id, payment_method, shipping_fee, total_amount]
    );
    const orderId = orderResult.rows[0].order_id;

    // Insert products associated with the order
    for (const product of products) {
      const { product_id, quantity } = product;

      // Validate product data
      if (!product_id || quantity === undefined) {
        throw new Error(
          "Invalid product data. Each product must have product_id and quantity."
        );
      }

      await client.query(
        `INSERT INTO orders_items (order_id, product_id, quantity)
         VALUES ($1, $2, $3)`,
        [orderId, product_id, quantity]
      );
    }

    await client.query("COMMIT"); // Commit transaction
    res.status(201).json({ message: "Order placed successfully", orderId });
  } catch (error) {
    await client.query("ROLLBACK"); // Rollback transaction on error

    // Log detailed error for debugging
    console.error("Error placing order:", error);

    // Respond with appropriate message
    if (error.message.includes("Invalid product data")) {
      res.status(400).json({ message: error.message });
    } else if (error.constraint) {
      res
        .status(400)
        .json({ message: `Database constraint error: ${error.constraint}` });
    } else {
      res.status(500).json({ message: "Internal server error" });
    }
  } finally {
    client.release(); // Release the client back to the pool
  }
});

module.exports = router;
