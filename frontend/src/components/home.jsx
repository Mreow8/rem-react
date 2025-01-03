import React from "react";
import { Link } from "react-router-dom";
import backgroundImage from "../assets/girlreading.webp";

const Home = () => {
  return (
    <div className="home-page">
      {/* Navbar */}
      <nav className="navbar navbar-light bg-white w-100 fixed-top">
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
      <div className="background-image-containers">
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
        .background-image-containers {
          position: fixed;
          z-index: 1;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: url(${backgroundImage});
          background-repeat: no-repeat;
          background-size: cover;
          background-position: center;
        }

        .background-image-containers::after {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(17, 16, 16, 0.664); /* Semi-transparent overlay */
          filter: grayscale(0.4) brightness(0.6); /* Apply filter here */
          z-index: 1; 
        }

        .background-text {
          color: white;
          z-index: 2; /* Place above the filter */
          padding: 20px;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          text-align: center;
        }

        .navbar {
          z-index: 3; /* Ensure navbar is above everything else */
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
