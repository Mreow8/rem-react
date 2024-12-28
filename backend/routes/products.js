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

// Routes for handling products
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

// Route to get all products
router.get("/", async (req, res) => {
  try {
    const result = await db.query(`
      SELECT products.*, stores.store_name
      FROM products
      INNER JOIN stores ON products.store_id = stores.store_id
    `);

    // Directly return the rows from the query
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error retrieving products:", error);
    res
      .status(500)
      .json({ message: "Error retrieving products", error: error.message });
  }
});

// Categories route
router.get("/categories", async (req, res) => {
  const query = "SELECT DISTINCT category AS name FROM products"; // Adjust query if needed

  try {
    const { rows } = await db.query(query); // Query the database for distinct categories
    res.status(200).json(rows); // Return the list of categories
  } catch (error) {
    console.error("Error retrieving categories from database:", error);
    res.status(500).json({ message: "Error retrieving categories." });
  }
});

router.get("/:id", (req, res) => {
  const productId = parseInt(req.params.id);

  const query =
    "SELECT products.*, stores.store_name, stores.province, stores.image AS seller_image FROM products inner join stores on stores.store_id = products.store_id WHERE user_id = ?";

  db.query(query, [productId], (error, results) => {
    if (error) {
      console.error("Error retrieving product:", error);
      return res.status(500).json({ message: "Error retrieving product" });
    }

    if (results.length === 0) {
      return res
        .status(404)
        .json({ message: `Product not found for ID: ${productId}` });
    }

    const product = {
      ...results[0],
      product_image: results[0].product_image
        ? `http://localhost:${process.env.PORT}/uploads/${results[0].product_image}`
        : null,
      seller_image: results[0].seller_image
        ? `http://localhost:${process.env.PORT}/seller_images/${results[0].seller_image}`
        : null,
    };

    res.json(product);
  });
});

// Export the router
module.exports = router;
