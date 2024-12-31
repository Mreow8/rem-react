import React from "react";
import { Link } from "react-router-dom";
import backgroundImage from "../assets/girlreading.webp";

const Home = () => {
  return (
    <div className="home-page">
      {/* Navbar */}
      <nav className="navbar navbar-light bg-white shadow w-100 fixed-top">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">
            <img
              src="remlogo.png"
              alt="Resource Exchange Marketplace Logo"
              width="50"
              height="50"
              className="d-inline-block align-text-top"
            />
          </Link>
          <p className="text-end mb-0">
            <Link to="/help" className="text-decoration-none">
              Need Help?
            </Link>
          </p>
        </div>
      </nav>

      {/* Background Section */}
      <div
        className="background-image-container"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center center",
          height: "100vh",
        }}
      >
        <div className="background-text">
          <h1>Welcome to Resource Exchange Marketplace</h1>
          <p>Find and share secondhand books</p>
          <Link to="/products">
            <button className="btn btn-primary">Shop Now</button>
          </Link>
        </div>
      </div>

      {/* Inline styles */}
      <style>{`
        .background-image-container {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-repeat: no-repeat;
          background-size: cover;
          background-position: center;
        }

        .background-image-container::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(17, 16, 16, 0.664);
          background-repeat: no-repeat;
          background-size: cover;
          background-position: center;
        }

        .background-text {
          color: white;
          z-index: 1000;
          padding: 20px;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          text-align: center;
        }

        .navbar {
          z-index: 3; 
        }

        /* Responsive styles for smaller screens */
        @media (max-width: 768px) {
          .background-text {
            width: 90%;
            font-size: 16px;
          }
        }

        @media (max-width: 576px) {
          .background-text {
            padding: 10px;
            font-size: 14px;
          }
        }
      `}</style>
    </div>
  );
};

export default Home;
