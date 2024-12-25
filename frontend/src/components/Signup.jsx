import React, { useState } from "react"; // Import useState
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/signup.css"; // Adjust the path as necessary
import { Link } from "react-router-dom";
import backgroundImage from "../assets/green_background.jfif"; // Adjust the path as necessary

const SignUp = () => {
  const [error, setError] = useState(""); // Use useState to manage error state
  const [showPassword, setShowPassword] = useState(false); // State for password visibility

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent the default form submission

    const phone = event.target.phoneInput.value;
    const password = event.target.passwordInput.value;
    const username = event.target.usernameInput.value; // Get the username input value

    // Phone validation: starts with '09' and has exactly 11 digits
    if (
      !phone.startsWith("09") ||
      phone.length !== 11 ||
      !/^\d+$/.test(phone)
    ) {
      setError("Input a valid phone number");
      return;
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      setError(
        "Password must be at least 8 characters long and include 1 uppercase letter, 1 number, and 1 special character."
      );
      return;
    }

    try {
      const response = await fetch(
        "https://rem-react.onrender.com/api/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ phone, password, username }), // Send data to server
        }
      );

      if (!response.ok) {
        const errorData = await response.json(); // Parse the error response
        console.error("Error response:", errorData);
        alert(errorData.message);
        return; // Stop execution if there's an error
      }

      const data = await response.json();
      alert(data.message); // Show success message
    } catch (error) {
      console.error("Error signing up:", error); // Handle errors
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword); // Toggle the state
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
              src="rem logo.png" // Ensure the path is correct
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
                  type={showPassword ? "text" : "password"} // Toggle input type between text and password
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
                  ></i>{" "}
                  {/* Bootstrap icon for eye */}
                </button>
              </div>
            </div>
            <button type="submit" className="btn btn-success w-100">
              SIGN UP
            </button>
          </form>

          {error && (
            <p
              style={{
                color: "red",
                fontSize: "13px",
                textAlign: "justify",
                width: "230px",
              }}
            >
              {error}
            </p>
          )}

          {/* Display error if any */}
          <p className="text-center mt-3">
            Already have an account? <Link to="/login">Log In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
