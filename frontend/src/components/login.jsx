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
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility
  const [phoneNumber, setPhoneNumber] = useState(""); // State for phone number input
  const [verificationCode, setVerificationCode] = useState(""); // State for verification code input
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setCredentials((prev) => ({ ...prev, [id]: value }));
  };

  // Helper function for validating phone number
  const isValidPhoneNumber = (phone) => {
    return phone.startsWith("09") && phone.length === 11 && /^\d+$/.test(phone);
  };

  // Helper function for validating email
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { identifier, password } = credentials;

    // Clear previous error messages
    setError("");

    // Validate the identifier (phone, email, or username)
    if (
      !isValidPhoneNumber(identifier) &&
      !isValidEmail(identifier) &&
      identifier.length < 3
    ) {
      setError("Please enter a valid phone number, email, ");
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

        if (data.message === "Wrong password") {
          setError("Wrong password");
        } else {
          setError(data.message || "Login failed, please try again.");
        }
        return; // Stop further execution if there's an error
      }

      const data = await response.json();
      console.log("Response data:", data);

      localStorage.setItem("username", identifier);
      localStorage.setItem("userId", data.user_id);
      localStorage.setItem("sellerStoreName", data.store_name);
      localStorage.setItem("sellerStoreId", data.store_id);

      console.log("User ID stored:", data.user_id);
      console.log("Store Name stored:", data.store_name);
      console.log("Store Id stored:", data.store_id);

      navigate("/products");
    } catch (error) {
      console.error("Login error:", error);
      setError(error.message);
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Clear error when input is focused
  const clearErrorOnFocus = () => {
    setError("");
  };

  // Handle Forgot Password click
  const handleForgotPasswordClick = () => {
    setIsModalOpen(true); // Show the modal
  };

  // Handle phone number input change
  const handlePhoneNumberChange = (e) => {
    setPhoneNumber(e.target.value);
  };

  // Handle verification code input change
  const handleVerificationCodeChange = (e) => {
    setVerificationCode(e.target.value);
  };

  // Submit phone number for verification
  const handlePhoneVerification = () => {
    if (isValidPhoneNumber(phoneNumber)) {
      // Here you can send the phone number to the backend for OTP sending
      alert("Verification code sent to " + phoneNumber);
      // Close the modal after sending the verification code
      setIsModalOpen(false);
    } else {
      alert("Please enter a valid phone number.");
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
      ></div>{" "}
      {/* Background Image Container */}
      <nav className="navbar navbar-light bg-white shadow w-100 fixed-top">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            <img
              src={remLogo}
              alt="Logo"
              width="60"
              height="60"
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
              {verificationCode && (
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
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
