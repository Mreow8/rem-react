import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/signup.css";
import { Link, useNavigate } from "react-router-dom";
import backgroundImage from "../assets/green_background.jfif";
import remLogo from "../assets/remlogo.png";
import Swal from "sweetalert2";

const SignUp = () => {
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState(""); // State to store formatted phone number
  const [email, setEmail] = useState(""); // State to store email
  const [username, setUsername] = useState(""); // State for username
  const [password, setPassword] = useState(""); // State for password
  const navigate = useNavigate();

  // Function to clear error message when an input field is focused
  const clearErrorOnFocus = () => {
    setError("");
  };

  // Handle email change
  const handleEmailChange = (event) => {
    setEmail(event.target.value.trim());
  };

  // Handle phone change
  const handlePhoneChange = (event) => {
    setPhone(event.target.value.trim());
  };

  // Handle username change
  const handleUsernameChange = (event) => {
    setUsername(event.target.value.trim());
  };

  // Handle password change
  const handlePasswordChange = (event) => {
    setPassword(event.target.value.trim());
  };

  // Validate email format
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validate email
    if (!isValidEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    // Validate phone number
    if (!/^\d{11}$/.test(phone)) {
      setError("Please enter a valid 11-digit phone number.");
      return;
    }

    // Validate password
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      setError(
        "Password must be at least 8 characters long and include an uppercase letter, a number, and a special character."
      );
      return;
    }

    try {
      const response = await fetch(
        "https://rem-reacts.onrender.com/api/profile/signup",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone, password, username, email }),
        }
      );

      const responseText = await response.text();
      let responseData;
      try {
        responseData = responseText ? JSON.parse(responseText) : {};
      } catch (error) {
        console.error("Failed to parse JSON response:", error);
        responseData = {};
      }

      console.log("Response data from the server:", responseData);
      if (!response.ok) {
        const errorText = responseText;
        console.error("Failed request:", errorText);
        setError(responseData.message);
        return;
      }

      // Show success alert with SweetAlert
      Swal.fire({
        title: "Success!",
        text: responseData.message,
        icon: "success",
        confirmButtonText: "OK",
        timer: 2000, // Automatically close after 2 seconds
        timerProgressBar: true,
        willClose: () => {
          // Redirect to login page after 2 seconds
          navigate("/login");
        },
      });
    } catch (error) {
      console.error("Error signing up:", error);
      setError(
        "An error occurred while processing your request. Please try again later."
      );
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-page">
      <div
        className="background-image-container"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
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
          <h1>
            Create an account to start buying and selling educational books
          </h1>
        </div>
        <div className="login-container shadow">
          <h3 className="login-title">Sign Up</h3>
          <form onSubmit={handleSubmit}>
            <div className="login mb-3">
              <label htmlFor="usernameInput" className="form-label">
                Username
              </label>
              <input
                type="text"
                className="form-control"
                id="usernameInput"
                name="usernameInput"
                placeholder="Enter your username"
                value={username}
                onChange={handleUsernameChange}
                required
                onFocus={clearErrorOnFocus} // Clear error on focus
              />
            </div>
            <div className="mb-3">
              <label htmlFor="emailInput" className="form-label">
                Email
              </label>
              <input
                type="email"
                className="form-control"
                id="emailInput"
                name="emailInput"
                placeholder="Enter your email"
                value={email}
                onChange={handleEmailChange}
                required
                onFocus={clearErrorOnFocus} // Clear error on focus
              />
            </div>
            <div className="mb-3">
              <label htmlFor="phoneInput" className="form-label">
                Phone
              </label>
              <input
                type="tel"
                className="form-control"
                id="phoneInput"
                name="phoneInput"
                placeholder="Enter your phone number"
                value={phone}
                onChange={handlePhoneChange}
                required
                onFocus={clearErrorOnFocus} // Clear error on focus
              />
            </div>
            <div className="mb-3">
              <label htmlFor="passwordInput" className="form-label">
                Password
              </label>
              <div className="input-group">
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control"
                  id="passwordInput"
                  name="passwordInput"
                  placeholder="Enter your password"
                  value={password}
                  onChange={handlePasswordChange}
                  required
                  onFocus={clearErrorOnFocus} // Clear error on focus
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
            <button type="submit" className="btn btn-success w-100">
              SIGN UP
            </button>
          </form>
          {error && (
            <p
              className="text-danger mt-2"
              style={{ fontSize: "13px", textAlign: "justify" }}
            >
              {error}
            </p>
          )}
          <p className="text-center mt-3">
            Already have an account? <Link to="/login">Log In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
