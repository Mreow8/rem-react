const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { Pool } = require("pg");
const cloudinary = require("cloudinary").v2;

const router = express.Router();
const db = new Pool({
  connectionString:
    "postgresql://rem_p4tm_user:Tu6m6KfFKADijl8ubmAYrHoxIkbDbCC0@dpg-ctg0cat2ng1s738oeq9g-a.singapore-postgres.render.com/rem_p4tm",
  ssl: { rejectUnauthorized: false },
});

// Configure Cloudinary
cloudinary.config({
  cloud_name: "dejfzfdk0", // Replace with your Cloudinary Cloud Name
  api_key: "567128668369977",
  api_secret: "-5FfUruzAK7jEpBKdZ3Xn1RXVU8",
});

// Configure Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// POST Route to Create Product
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

  if (!req.file || !product_name || !product_price || !product_quantity) {
    return res
      .status(400)
      .json({ message: "All fields and an image are required." });
  }

  try {
    // Upload image to Cloudinary
    const cloudinaryResult = await cloudinary.uploader.upload(req.file.path, {
      folder: "product_images",
    });

    // Cleanup local temporary file
    fs.unlink(req.file.path, (err) => {
      if (err) console.error("Error deleting temporary file:", err);
    });

    const productImageUrl = cloudinaryResult.secure_url;

    const query = `
      INSERT INTO products 
      (store_id, product_image, product_name, product_price, product_quantity, product_author, product_description, created_at, updated_at, category) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW(), $8)
    `;
    await db.query(query, [
      store_id,
      productImageUrl,
      product_name,
      product_price,
      product_quantity,
      product_author,
      product_description,
      product_category,
    ]);

    res.status(201).json({ message: "Product added successfully!" });
  } catch (error) {
    console.error("Error saving product:", error);
    res
      .status(500)
      .json({ message: "Error saving product", error: error.message });
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
