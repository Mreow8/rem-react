import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/login.css"; // Ensure this path is correct
import { Link, useNavigate } from "react-router-dom";
import backgroundImage from "../assets/green_background.jfif"; // Adjust the path as necessary
import remLogo from "../assets/remlogo.png";

const Login = () => {
  const [credentials, setCredentials] = useState({
    identifier: "",
    password: "",
  });
  const [phone, setPhone] = useState(""); // State to store formatted phone number

  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isVerificationSent, setIsVerificationSent] = useState(false);
  const [isCodeVerified, setIsCodeVerified] = useState(false); // Track if code is verified
  const [newPassword, setNewPassword] = useState(""); // New password input
  const navigate = useNavigate();

  const handlePhoneChange = (event) => {
    let value = event.target.value.trim();
    if (value.startsWith("09")) {
      value = "+63" + value.slice(1); // Remove the '0' and add '+63'
    }
    setPhone(value); // Update the phone state
  };

  const handleChange = (e) => {
    const { id, value } = e.target;

    // If the field is phone number (identifier), format it to include the country code
    if (id === "identifier" && value.startsWith("09")) {
      // Format the phone number to prepend '+63' for local numbers starting with '09'
      setCredentials((prev) => ({
        ...prev,
        [id]: "+63" + value.slice(1), // Replace '0' with '+63'
      }));
    } else {
      // For other fields (like email or password), just update the value normally
      setCredentials((prev) => ({ ...prev, [id]: value }));
    }
  };

  const isValidPhoneNumber = (phone) => {
    return (
      (phone.startsWith("09") && phone.length === 11 && /^\d+$/.test(phone)) || // Local format (starts with 09)
      (phone.startsWith("+639") && phone.length === 13 && /^\d+$/.test(phone)) // International format (starts with +639)
    );
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { identifier, password } = credentials;

    setError("");

    if (
      !isValidPhoneNumber(identifier) &&
      !isValidEmail(identifier) &&
      identifier.length < 3
    ) {
      setError("Please enter a valid phone number, email.");
      return;
    }

    try {
      const response = await fetch(
        "https://rem-reacts.onrender.com/api/profile/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ identifier, password }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        setError(data.message || "Login failed, please try again.");
        return;
      }

      const data = await response.json();
      localStorage.setItem("username", identifier);
      localStorage.setItem("userId", data.user_id);
      localStorage.setItem("sellerStoreName", data.store_name);
      localStorage.setItem("sellerStoreId", data.store_id);

      navigate("/products");
    } catch (error) {
      console.error("Login error:", error);
      setError(error.message);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const clearErrorOnFocus = () => {
    setError("");
  };

  const handleForgotPasswordClick = () => {
    setIsModalOpen(true);
  };

  const handlePhoneNumberChange = (e) => {
    let value = e.target.value.trim(); // Get the input value without leading/trailing spaces

    // Check if the value starts with '09' and prepend '+63'
    if (value.startsWith("09")) {
      value = "+63" + value.slice(1); // Replace '0' with '+63'
    }

    setPhoneNumber(value); // Update the phone number state with the formatted value
  };

  const handleVerificationCodeChange = (e) => {
    setVerificationCode(e.target.value);
  };

  // Submit phone number for OTP verification
  const handlePhoneVerification = async () => {
    if (isValidPhoneNumber(phoneNumber)) {
      try {
        // Send the phone number to the backend to check if it exists and send OTP
        const response = await fetch(
          "https://rem-reacts.onrender.com/api/auth/send-otp", // Replace with your backend URL
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ phone: phoneNumber }),
          }
        );

        if (response.ok) {
          setIsVerificationSent(true); // Mark that the verification code has been sent
          alert("Verification code sent to " + phoneNumber);
        } else {
          const data = await response.json();
          alert(data.message || "Failed to send verification code.");
        }
      } catch (error) {
        console.error("Error sending OTP:", error);
        alert("An error occurred while sending OTP.");
      }
    } else {
      alert("Please enter a valid phone number.");
    }
  };

  // Submit verification code
  const handleVerificationCodeSubmit = async () => {
    if (verificationCode) {
      try {
        const response = await fetch(
          "https://rem-reacts.onrender.com/api/auth/verify-otp", // Replace with your backend URL
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              phone: phoneNumber,
              code: verificationCode,
            }),
          }
        );

        if (response.ok) {
          alert("Verification successful.");
          setIsModalOpen(false); // Close the modal after verification
          setIsCodeVerified(true); // Mark as verified
        } else {
          const data = await response.json();
          alert(data.message || "Invalid verification code.");
        }
      } catch (error) {
        console.error("Error verifying code:", error);
        alert("An error occurred while verifying the code.");
      }
    } else {
      alert("Please enter the verification code.");
    }
  };

  // Handle new password submission
  const handleNewPasswordSubmit = async () => {
    if (newPassword) {
      try {
        // Send the new password to the backend for updating
        const response = await fetch(
          "https://rem-reacts.onrender.com/api/auth/update-password", // Replace with your backend URL
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              phone: phoneNumber,
              newPassword: newPassword,
            }),
          }
        );

        if (response.ok) {
          alert("Password updated successfully.");
          setIsModalOpen(false); // Close the modal after updating
        } else {
          const data = await response.json();
          alert(data.message || "Failed to update password.");
        }
      } catch (error) {
        console.error("Error updating password:", error);
        alert("An error occurred while updating the password.");
      }
    } else {
      alert("Please enter a new password.");
    }
  };

  return (
    <div className="login-page">
      <div
        className="background-image-container"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center center",
          height: "100vh",
        }}
      ></div>
      <nav className="navbar navbar-light bg-white shadow w-100 fixed-top">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            <img
              src={remLogo}
              alt="Logo"
              width="50"
              height="50"
              className="d-inline-block align-text-top"
            />
          </a>
          <p className="text-end">
            <Link to="/need">Need Help?</Link>
          </p>
        </div>
      </nav>
      <div className="main-container">
        <div className="background-text">
          <h1>Login to access your account</h1>
        </div>
        <div className="login-container shadow">
          <h3 className="login-title">Login</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="identifier" className="form-label">
                Email, or Phone
              </label>
              <input
                type="text"
                className="form-control"
                id="identifier"
                placeholder="Enter your email/phone"
                value={credentials.identifier}
                onChange={handleChange}
                required
                onFocus={clearErrorOnFocus} // Clear error when clicked
              />
            </div>
            <div className="login mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <div className="input-group">
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control"
                  id="password"
                  placeholder="Enter your password"
                  value={credentials.password}
                  onChange={handleChange}
                  required
                  onFocus={clearErrorOnFocus} // Clear error when clicked
                />
                <button
                  type="button"
                  className="btn btn-light"
                  onClick={togglePasswordVisibility}
                >
                  <i
                    className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}
                    style={{ fontSize: "18px", color: "#000" }}
                  ></i>
                </button>
              </div>
            </div>
            <button type="submit" className="btn btn-primary w-100">
              LOGIN
            </button>
          </form>
          {error && <div className="alert alert-danger">{error}</div>}
          <p className="text-center mt-3">
            Don't have an account? <Link to="/signup">Sign Up</Link>
          </p>
          <a href="#" onClick={handleForgotPasswordClick}>
            Forgot Password?
          </a>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <div
        className={`modal ${isModalOpen ? "show" : ""}`}
        style={{ display: isModalOpen ? "block" : "none" }}
        tabIndex="-1"
        aria-labelledby="forgotPasswordModal"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="forgotPasswordModal">
                Forgot Password
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={() => setIsModalOpen(false)}
              ></button>
            </div>
            <div className="modal-body">
              {!isVerificationSent ? (
                <>
                  <div className="mb-3">
                    <label htmlFor="phoneNumber" className="form-label">
                      Enter your phone number
                    </label>
                    <input
                      type="text"
                      id="phoneNumber"
                      className="form-control"
                      placeholder="Enter your phone number"
                      value={phoneNumber}
                      onChange={handlePhoneNumberChange}
                      required
                    />
                  </div>
                  <button
                    className="btn btn-primary"
                    onClick={handlePhoneVerification}
                  >
                    Send Verification Code
                  </button>
                </>
              ) : (
                <>
                  <div className="mb-3 mt-3">
                    <label htmlFor="verificationCode" className="form-label">
                      Enter verification code
                    </label>
                    <input
                      type="text"
                      id="verificationCode"
                      className="form-control"
                      placeholder="Enter code"
                      value={verificationCode}
                      onChange={handleVerificationCodeChange}
                    />
                  </div>
                  <button
                    className="btn btn-primary"
                    onClick={handleVerificationCodeSubmit}
                  >
                    Submit Verification Code
                  </button>
                </>
              )}

              {isCodeVerified && (
                <>
                  <div className="mb-3 mt-3">
                    <label htmlFor="newPassword" className="form-label">
                      Enter New Password
                    </label>
                    <input
                      type="password"
                      id="newPassword"
                      className="form-control"
                      placeholder="Enter your new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>
                  <button
                    className="btn btn-primary"
                    onClick={handleNewPasswordSubmit}
                  >
                    Submit New Password
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
