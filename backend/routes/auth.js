const express = require("express");
const router = express.Router();
const pool = require("../config/db"); // Your database pool for DB queries
require("dotenv").config();

const twilio = require("twilio");
const { v4: uuidv4 } = require("uuid"); // Generates a unique OTP key

// Twilio credentials (loaded from .env)
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioClient = new twilio(accountSid, authToken);
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
// Generates a u
// In-memory OTP store (should be replaced with a persistent store)
const otpStore = {};

// Send OTP Route
router.post("/send-otp", async (req, res) => {
  const { phone } = req.body;

  if (!phone) {
    return res.status(400).json({ message: "Phone number is required." });
  }

  try {
    // Check if the phone number already exists in the database
    const checkPhoneQuery = "SELECT * FROM users WHERE phone = $1";
    const { rows: phoneRows } = await pool.query(checkPhoneQuery, [phone]);

    if (phoneRows.length === 0) {
      return res.status(404).json({ message: "Phone number not registered." });
    }

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000);

    // Store OTP with a unique key (use user phone and a UUID for uniqueness)
    otpStore[phone] = { otp, expiry: Date.now() + 300000 }; // OTP expires in 5 minutes

    // Send OTP via Twilio
    await twilioClient.messages.create({
      body: `Your OTP code is: ${otp}`,
      to: phone,
      from: twilioPhoneNumber,
    });

    res.status(200).json({
      message: "OTP sent successfully.",
    });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ message: "Failed to send OTP. Please try again." });
  }
});

// Verify OTP and Update Password Route
router.post("/verify-otp", async (req, res) => {
  const { phone, otp, newPassword } = req.body;

  if (!phone || !otp || !newPassword) {
    return res.status(400).json({
      message: "Phone number, OTP, and new password are required.",
    });
  }

  // Check if OTP exists for the phone number
  const storedOtp = otpStore[phone];

  if (!storedOtp) {
    return res
      .status(400)
      .json({ message: "OTP not sent to this phone number." });
  }

  // Check if the OTP is expired
  if (Date.now() > storedOtp.expiry) {
    delete otpStore[phone]; // Remove expired OTP
    return res.status(400).json({
      message: "OTP has expired. Please request a new one.",
    });
  }

  // Verify OTP
  if (storedOtp.otp.toString() !== otp.toString()) {
    return res.status(400).json({ message: "Invalid OTP." });
  }

  // OTP is valid, proceed with the password update
  try {
    // Update the user's password in the database
    const updatePasswordQuery =
      "UPDATE users SET password = $1 WHERE phone = $2 RETURNING *";
    const { rows } = await pool.query(updatePasswordQuery, [
      newPassword,
      phone,
    ]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found." });
    }

    // OTP is valid, proceed with the password update
    delete otpStore[phone]; // Remove the OTP once verified

    res.status(200).json({
      message: "Password updated successfully.",
    });
  } catch (error) {
    console.error("Error updating password:", error);
    res
      .status(500)
      .json({ message: "Failed to update password. Please try again." });
  }
});

// Placeholder middleware for user authentication (use your own mechanism)
const authenticateUser = (req, res, next) => {
  console.log("Authentication placeholder.");
  next();
};

// Example of protected route (user profile)
router.get("/:userId", authenticateUser, async (req, res) => {
  const { userId } = req.params;

  try {
    const query = "SELECT user_id, phone, email FROM users WHERE user_id = $1";
    const { rows } = await pool.query(query, [userId]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = rows[0];
    res.status(200).json({
      message: "User profile retrieved successfully",
      user: {
        userId: user.user_id,
        phoneNumber: user.phone,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
