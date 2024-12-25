import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/signup.css";
import { Link } from "react-router-dom";
import backgroundImage from "../assets/green_background.jfif";

const SignUp = () => {
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const phone = event.target.phoneInput.value.trim();
    const password = event.target.passwordInput.value.trim();
    const username = event.target.usernameInput.value.trim();

    // Validate phone number
    if (
      !phone.startsWith("09") ||
      phone.length !== 11 ||
      !/^\d+$/.test(phone)
    ) {
      setError(
        "Please enter a valid phone number (starting with '09' and 11 digits)."
      );
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
        "https://rem-react.onrender.com/api/signup",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone, password, username }),
        }
      );

      const responseData = await response.json();

      if (!response.ok) {
        setError(responseData.message);
        return;
      }

      alert(responseData.message);
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
              src="rem_logo.png"
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
          <h1>
            Create an account to start buying and selling educational books
          </h1>
        </div>
        <div className="login-container shadow">
          <h3 className="login-title">Sign Up</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="usernameInput" className="form-label">
                Username
              </label>
              <input
                type="text"
                className="form-control"
                id="usernameInput"
                name="usernameInput"
                placeholder="Enter your username"
                required
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
                required
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
                  required
                />
                <button
                  type="button"
                  className="btn btn-light"
                  onClick={togglePasswordVisibility}
                >
                  <i
                    className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}
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
