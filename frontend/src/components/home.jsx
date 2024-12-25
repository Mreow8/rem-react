import React from "react";
import { Link } from "react-router-dom";
import "../css/home.css";
import backgroundImage from "../assets/girlreading.webp"; // Adjust the path as necessary

const Home = () => {
  return (
    <div className="home-page">
      {/* Navbar */}
      <nav className="navbar navbar-light bg-white shadow w-100 fixed-top">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">
            {/* Adjusted the logo source */}
            {/* <img
              src="/remlogo.png" // If the logo is in the public folder
              alt="Resource Exchange Marketplace Logo"
              width="60"
              height="70"
              className="d-inline-block align-text-top"
            /> */}
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
          <Link to="/login">
            <button className="btn btn-primary">Login</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
