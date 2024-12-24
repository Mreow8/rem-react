const express = require("express");
const path = require("path");
const cors = require("cors");
const connectDB = require("./config/db"); // Import the database connection

const app = express();
const PORT = process.env.PORT || 3001;

// Load environment variables
require("dotenv").config();

// Connect to the database
connectDB();

// Middleware
app.use(cors()); // Enable CORS if needed
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies

// // Serve static files from the React build directory
// app.use(express.static(path.join(__dirname, "../rem-react/build")));

// // Catch-all handler to serve React app for non-API routes
// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "../rem-react/build", "index.html"));
// });

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
