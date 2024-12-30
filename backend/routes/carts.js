const express = require("express");
const multer = require("multer");
const { v2: cloudinary } = require("cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const pool = require("../config/db"); // PostgreSQL connection pool

// Cloudinary configuration
cloudinary.config({
  cloud_name: "dejfzfdk0", // Replace with your Cloudinary Cloud Name
  api_key: "567128668369977", // Replace with your API Key
  api_secret: "-5FfUruzAK7jEpBKdZ3Xn1RXVU8", // Replace with your API Secret
});

// Configure Multer with Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "products", // Cloudinary folder for product images
    allowedFormats: ["jpg", "jpeg", "png"],
    public_id: (req, file) => Date.now() + "-" + file.originalname,
  },
});

const upload = multer({ storage });

const app = express();

// POST route to add a product with an image to the cart
app.post(
  "/api/cart/:userId/:productId",
  upload.single("product_image"),
  (req, res) => {
    const { userId, productId } = req.params;
    const { quantity } = req.body;

    if (!userId || !productId || quantity === undefined) {
      return res
        .status(400)
        .json({ message: "User ID, Product ID, and Quantity are required." });
    }

    // Get the image URL from Cloudinary response
    const productImage = req.file ? req.file.path : null;

    // SQL query to insert a product into the cart
    const query = `
    INSERT INTO cart (user_id, product_id, quantity, product_image)
    VALUES ($1, $2, $3, $4) RETURNING cart_id;
  `;

    pool.query(
      query,
      [userId, productId, quantity, productImage],
      (error, results) => {
        if (error) {
          console.error("Error adding product to cart:", error);
          return res
            .status(500)
            .json({ message: "Error adding product to cart." });
        }

        res.status(201).json({
          message: "Product added to cart successfully!",
          cartId: results.rows[0].cart_id,
        });
      }
    );
  }
);

// Get cart items for a user, including Cloudinary image URLs
app.get("/api/cart/:userId", (req, res) => {
  const userId = req.params.userId;
  const query = `
      SELECT 
        products.product_name,
        products.product_price,
        products.product_image,
        cart.quantity,
        sellers.store_name AS seller_username,
        cart.product_id
      FROM 
        cart
      JOIN 
        products ON cart.product_id = products.id
      JOIN 
        sellers ON products.store_id = sellers.store_id
      WHERE 
        cart.user_id = $1
    `;

  pool.query(query, [userId], (error, results) => {
    if (error) {
      console.error("Error retrieving cart items:", error);
      return res.status(500).json({ message: "Error retrieving cart items" });
    }

    // Add the Cloudinary image URL or fallback image to the response
    const productsWithImages = results.rows.map((product) => ({
      ...product,
      product_image: product.product_image
        ? `https://res.cloudinary.com/dejfzfdk0/image/upload/v1/products/${product.product_image}`
        : "placeholder_image.png", // Provide a default placeholder image
    }));

    res.status(200).json(productsWithImages);
  });
});

// Delete item from cart
app.delete("/api/cart/:userId/:productId", (req, res) => {
  const { userId, productId } = req.params;

  if (!userId || !productId) {
    return res
      .status(400)
      .json({ message: "User ID and Product ID are required" });
  }

  const query = "DELETE FROM cart WHERE user_id = $1 AND product_id = $2";

  pool.query(query, [userId, productId], (error, results) => {
    if (error) {
      console.error("Error deleting cart item:", error);
      return res.status(500).json({ message: "Error deleting cart item" });
    }

    if (results.rowCount === 0) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    res.json({ message: "Cart item removed successfully" });
  });
});

// Update item quantity in cart
app.put("/api/carts", (req, res) => {
  const { user_id, product_id, quantity } = req.body;

  if (!user_id || !product_id || quantity === undefined) {
    return res
      .status(400)
      .json({ message: "User ID, product ID, and quantity are required." });
  }

  const query = `
      UPDATE cart 
      SET quantity = $1 
      WHERE user_id = $2 AND product_id = $3
    `;

  pool.query(query, [quantity, user_id, product_id], (error, results) => {
    if (error) {
      console.error("Error updating item quantity:", error);
      return res.status(500).json({ message: "Error updating item quantity" });
    }

    res.status(200).json({ message: "Item quantity updated successfully!" });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});