const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const pool = require("../config/db"); // This should be the correct import
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const router = express.Router();

cloudinary.config({
  cloud_name: "dejfzfdk0", // Replace with your Cloudinary Cloud Name
  api_key: "567128668369977", // Replace with your API Key
  api_secret: "-5FfUruzAK7jEpBKdZ3Xn1RXVU8", // Replace with your API Secret
});

// Configure Multer with Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "products",
    allowedFormats: ["jpg", "jpeg", "png"],
    public_id: (req, file) => Date.now() + "-" + file.originalname,
  },
});

const upload = multer({ storage });

// POST route to create a new product
router.post("/", upload.single("product_image"), async (req, res) => {
  const {
    store_id,
    product_name,
    product_price,
    stock,
    product_author,
    product_description,
    category,
    product_publisher,
    product_dimensions,
    product_weight,
    product_pages,
  } = req.body;

  const productImage = req.file ? req.file.path : null; // Cloudinary file URL

  if (!store_id || !product_name || !product_price || !stock) {
    return res.status(400).json({ message: "Required fields are missing." });
  }

  console.log("Inserting product data:", {
    store_id,
    product_name,
    product_price,
    stock,
    product_author,
    product_description,
    category,
    product_publisher,
    product_dimensions,
    product_weight,
    product_pages,
    productImage,
  });

  const query = `
  INSERT INTO products (
    store_id,
    product_name,
    product_price,
    stock,
    product_author,
    product_description,
    category,
    product_image,
    product_publisher,
    product_dimensions,
    product_weight,
    product_pages
  ) 
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
  RETURNING id;
`;

  try {
    const result = await pool.query(query, [
      store_id,
      product_name,
      product_price,
      stock,
      product_author,
      product_description,
      category,
      productImage,
      product_publisher,
      product_dimensions,
      product_weight,
      product_pages,
    ]);

    res.status(201).json({
      message: "Product added successfully!",
      productId: result.rows[0].id,
    });
  } catch (error) {
    console.error("Error saving product data:", error.message);

    if (error.code === "23505") {
      // Handle unique violation error
      return res.status(409).json({
        message: "Conflict: A product with this data already exists.",
      });
    }

    if (error.code === "ECONNREFUSED") {
      // Handle database connection error
      return res.status(503).json({
        message: "Database connection failed. Please try again later.",
      });
    }

    // General server error
    res.status(500).json({ message: "Error saving product data" });
  }
});

// GET Route to Retrieve All Products
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT products.*, stores.store_name
      FROM products
      INNER JOIN stores ON products.store_id = stores.store_id
    `);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error retrieving products:", error);
    res
      .status(500)
      .json({ message: "Error retrieving products", error: error.message });
  }
});

// GET Route for Categories
router.get("/categories", async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT DISTINCT category AS name FROM products"
    );
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error retrieving categories:", error);
    res.status(500).json({ message: "Error retrieving categories." });
  }
});

// GET Route for Single Product by ID
router.get("/:id", async (req, res) => {
  const productId = parseInt(req.params.id);

  try {
    const query = `
      SELECT products.*, stores.store_name, stores.province, stores.image AS seller_image, stores.region
      FROM products 
      INNER JOIN stores ON stores.store_id = products.store_id 
      WHERE products.id = $1
    `;
    const { rows } = await pool.query(query, [productId]);

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ message: `Product not found for ID: ${productId}` });
    }

    const product = {
      ...rows[0],
      product_image: rows[0].product_image,
      seller_image: rows[0].seller_image,
    };

    res.json(product);
  } catch (error) {
    console.error("Error retrieving product:", error);
    res.status(500).json({ message: "Error retrieving product" });
  }
});
// PUT Route to Update an Existing Product
router.put("/:id", upload.single("product_image"), async (req, res) => {
  const productId = parseInt(req.params.id);
  const {
    product_name,
    product_price,
    stock,
    product_author,
    product_description,
    category,
    product_publisher,
    product_dimensions,
    product_weight,
    product_pages,
  } = req.body;

  // Use the existing image URL if no new image is provided
  let productImage = req.file ? req.file.path : null;

  // Check if required fields are present
  if (!product_name || !product_price || !stock) {
    return res.status(400).json({ message: "Required fields are missing." });
  }

  try {
    // Fetch existing product from the database
    const existingProductQuery = `
      SELECT * FROM products WHERE id = $1;
    `;
    const existingProduct = await pool.query(existingProductQuery, [productId]);

    if (existingProduct.rows.length === 0) {
      return res.status(404).json({ message: "Product not found." });
    }

    // If no new image was uploaded, use the existing image URL
    if (!productImage) {
      productImage = existingProduct.rows[0].product_image;
    }

    const query = `
      UPDATE products
      SET
        store_id = $1,
        product_name = $2,
        product_price = $3,
        stock = $4,
        product_author = $5,
        product_description = $6,
        category = $7,
        product_image = $8,
        product_publisher = $9,
        product_dimensions = $10,
        product_weight = $11,
        product_pages = $12
      WHERE id = $13
      RETURNING id;
    `;

    // Execute the update query
    const result = await pool.query(query, [
      store_id,
      product_name,
      product_price,
      stock,
      product_author,
      product_description,
      category,
      productImage,
      product_publisher,
      product_dimensions,
      product_weight,
      product_pages,
      productId,
    ]);

    res.status(200).json({
      message: "Product updated successfully!",
      productId: result.rows[0].id,
    });
  } catch (error) {
    console.error("Error updating product data:", error.message);

    if (error.code === "23505") {
      // Handle unique violation error
      return res.status(409).json({
        message: "Conflict: A product with this data already exists.",
      });
    }

    if (error.code === "ECONNREFUSED") {
      // Handle database connection error
      return res.status(503).json({
        message: "Database connection failed. Please try again later.",
      });
    }

    // General server error
    res.status(500).json({ message: "Error updating product data" });
  }
});

// Export the Router
module.exports = router;
