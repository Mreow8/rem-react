const twilio = require("twilio");
require("dotenv").config();

// Twilio credentials from .env
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

// Create Twilio client
const twilioClient = new twilio(accountSid, authToken);

// Test OTP sending
const phoneNumber = "+639562441537"; // Replace with a valid phone number

twilioClient.messages
  .create({
    body: "Your OTP is 123456",
    to: phoneNumber, // The phone number you want to send OTP to
    from: twilioPhoneNumber, // Your Twilio phone number
  })
  .then((message) => {
    console.log("Message SID:", message.sid);
    console.log("Message sent successfully!");
  })
  .catch((error) => {
    console.error("Error sending message:", error);
  });
