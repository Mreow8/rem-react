const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { Pool } = require("pg");

const router = express.Router();
const db = new Pool({
  connectionString:
    "postgresql://rem_p4tm_user:Tu6m6KfFKADijl8ubmAYrHoxIkbDbCC0@dpg-ctg0cat2ng1s738oeq9g-a.singapore-postgres.render.com/rem_p4tm",
  ssl: { rejectUnauthorized: false },
});

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Configure Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Routes
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

  const productImage = req.file.filename;

  try {
    const query = `
      INSERT INTO products 
      (store_id, product_image, product_name, product_price, product_quantity, product_author, product_description, created_at, updated_at, category) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW(), $8)
    `;
    await db.query(query, [
      store_id,
      productImage,
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

router.get("/", async (req, res) => {
  try {
    const result = await db.query(`
      SELECT products.*, sellers.store_name, sellers.image AS seller_image
      FROM products
      INNER JOIN sellers ON products.store_id = sellers.store_id
    `);

    const products = result.rows.map((product) => ({
      ...product,
      product_image: product.product_image
        ? `http://localhost:3001/uploads/${product.product_image}`
        : null,
      seller_image: product.seller_image
        ? `http://localhost:3001/seller_images/${product.seller_image}`
        : null,
    }));

    res.status(200).json(products);
  } catch (error) {
    console.error("Error retrieving products:", error);
    res.status(500).json({ message: "Error retrieving products" });
  }
});

// Export the router
module.exports = router;
