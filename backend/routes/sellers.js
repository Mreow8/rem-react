const express = require("express");
const multer = require("multer");
const { v2: cloudinary } = require("cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const pool = require("../config/db"); // PostgreSQL connection pool

// Cloudinary configuration
cloudinary.config({
  cloud_name: "dejfzfdk0", // Replace with your Cloudinary Cloud Name
  api_key: "567128668369977",
  api_secret: "-5FfUruzAK7jEpBKdZ3Xn1RXVU8",
});

// Configure Multer with Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "sellers",
    allowedFormats: ["jpg", "jpeg", "png"],
    public_id: (req, file) => Date.now() + "-" + file.originalname,
  },
});

const upload = multer({ storage });

const router = express.Router(); // Create a new router

// POST route to create a new seller
router.post("/", upload.single("store_image"), async (req, res) => {
  const {
    user_id,
    store_name,
    phone,
    email,
    region,
    province,
    city,
    barangay,
    postal_code,
  } = req.body;

  const storeImage = req.file ? req.file.path : null; // Cloudinary file URL

  if (!user_id) {
    return res.status(400).json({ message: "User ID is required." });
  }

  console.log("Inserting seller data:", {
    user_id,
    store_name,
    phone,
    email,
    region,
    province,
    city,
    barangay,
    postal_code,
    storeImage,
  });

  // SQL query to insert seller details
  const query = `
    INSERT INTO stores (user_id, store_name, phone, email, region, province, city, barangay, postal_code, image)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING store_id;
   `;

  try {
    const result = await pool.query(query, [
      user_id,
      store_name,
      phone,
      email,
      region,
      province,
      city,
      barangay,
      postal_code,
      storeImage,
    ]);

    res.status(201).json({
      message: "Seller added successfully!",
      sellerId: result.rows[0].store_id,
    });
  } catch (error) {
    console.error("Error saving seller data:", error.message);

    if (error.code === "23505") {
      // Handle unique violation error (for example, duplicate email or phone)
      return res
        .status(409)
        .json({ message: "Conflict: A seller with this data already exists." });
    }

    if (error.code === "ECONNREFUSED") {
      // Handle connection error
      return res.status(503).json({
        message: "Database connection failed. Please try again later.",
      });
    }

    // General server error
    res.status(500).json({ message: "Error saving seller data" });
  }
});

router.get("/:userId", async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ message: "User ID is required." });
  }

  const query = `
    SELECT products.*, stores.store_id, stores.store_name, stores.phone, stores.email, 
       stores.region, stores.province, stores.city, stores.barangay, stores.postal_code, stores.image
FROM stores
INNER JOIN products ON products.store_id = stores.store_id
WHERE stores.user_id = $1;

  `;

  try {
    const result = await pool.query(query, [userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Seller not found." });
    }

    // Send the seller data as response
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching seller data [[[]]]:", error.message);

    if (error.code === "ECONNREFUSED") {
      // Handle connection error
      return res.status(503).json({
        message: "Database connection failed. Please try again later.",
      });
    }

    // General server error
    res.status(500).json({ message: "Error fetching seller data //" });
  }
});

module.exports = router; // Export the router
