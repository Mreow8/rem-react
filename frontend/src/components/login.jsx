import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/login.css"; // Ensure this path is correct
import { Link, useNavigate } from "react-router-dom";
import backgroundImage from "../assets/green_background.jfif"; // Adjust the path as necessary
import Nav from "./nav";

const Login = () => {
  const [credentials, setCredentials] = useState({
    identifier: "",
    password: "",
  });
  const [error, setError] = useState("");
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
      setError("Please enter a valid phone number, email, or username.");
      return;
    }

    // Validate password (for simplicity, just check length here)

    try {
      const response = await fetch("https://rem-react.onrender.com/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ identifier, password }),
      });

      // Check if the response is not OK
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

      // Store the username and user ID in localStorage
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
              src="rem logo.png"
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
                Username, Email, or Phone
              </label>
              <input
                type="text"
                className="form-control"
                id="identifier"
                placeholder="Enter your username/email/phone"
                value={credentials.identifier}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder="Enter your password"
                value={credentials.password}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">
              LOGIN
            </button>
          </form>
          {error && <div className="alert alert-danger">{error}</div>}
          <p className="text-center mt-3">
            Don't have an account? <Link to="/signup">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
