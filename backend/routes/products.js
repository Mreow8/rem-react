const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const pool = require("../config/db");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const router = express.Router();
const db = new Pool({
  connectionString:
    "postgresql://rem_p4tm_user:Tu6m6KfFKADijl8ubmAYrHoxIkbDbCC0@dpg-ctg0cat2ng1s738oeq9g-a.singapore-postgres.render.com/rem_p4tm",
  ssl: { rejectUnauthorized: false },
});

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
    product_quantity,
    product_author,
    product_description,
    product_category,
  } = req.body;

  const productImage = req.file ? req.file.path : null; // Cloudinary file URL

  if (!store_id || !product_name || !product_price || !product_quantity) {
    return res.status(400).json({ message: "Required fields are missing." });
  }

  console.log("Inserting product data:", {
    store_id,
    product_name,
    product_price,
    product_quantity,
    product_author,
    product_description,
    product_category,
    productImage,
  });

  // SQL query to insert product details
  const query = `
    INSERT INTO products (store_id, product_name, product_price, product_quantity, product_author, product_description, product_category, image)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING product_id;
  `;

  try {
    const result = await pool.query(query, [
      store_id,
      product_name,
      product_price,
      product_quantity,
      product_author,
      product_description,
      product_category,
      productImage,
    ]);

    res.status(201).json({
      message: "Product added successfully!",
      productId: result.rows[0].product_id,
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
    const result = await db.query(`
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
    const { rows } = await db.query(
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
      SELECT products.*, stores.store_name, stores.province, stores.image AS seller_image 
      FROM products 
      INNER JOIN stores ON stores.store_id = products.store_id 
      WHERE products.product_id = $1
    `;
    const { rows } = await db.query(query, [productId]);

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

// Export the Router
module.exports = router;
