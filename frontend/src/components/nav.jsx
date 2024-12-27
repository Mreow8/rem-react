import React, { useState, useEffect } from "react";
import "../css/nav.css";
import { Link, useNavigate } from "react-router-dom"; // Use useNavigate instead of useHistory
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faShoppingCart,
} from "@fortawesome/free-solid-svg-icons";
import remLogo from "../assets/remlogo.png";

const Nav = ({ handleLogout, searchQuery, handleSearchChange }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [username, setUsername] = useState(null);
  const [sellerStoreName, setSellerStoreName] = useState(null);
  const [sellerStoreId, setSellerStoreId] = useState(null);
  const navigate = useNavigate(); // Use useNavigate for navigation

  useEffect(() => {
    setUsername(localStorage.getItem("username"));
    setSellerStoreName(localStorage.getItem("sellerStoreName"));
    setSellerStoreId(localStorage.getItem("sellerStoreId"));

    console.log("Retrieved Username:", localStorage.getItem("username"));
    console.log(
      "Retrieved Seller Store Name:",
      localStorage.getItem("sellerStoreName")
    );
    console.log(
      "Retrieved Seller Store ID:",
      localStorage.getItem("sellerStoreId")
    );

    // Add event listener to close the menu if the user clicks anywhere on the page
    const handleClickOutside = (event) => {
      if (
        event.target.closest("#menu") === null &&
        event.target.id !== "btn_username"
      ) {
        setIsMenuOpen(false); // Close the menu if clicked outside
      }
    };

    // Attach the event listener
    document.addEventListener("click", handleClickOutside);

    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleLogoutClick = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    localStorage.removeItem("sellerStoreName");
    localStorage.removeItem("sellerStoreId");
    setUsername(null);
  };

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const handleLoginClick = () => {
    // Prevent navigation if the user is logged in
    if (!username) {
      navigate("/login"); // Navigate to login if not logged in
    }
  };

  const renderSellerSection = () => {
    if (
      sellerStoreId &&
      sellerStoreId !== "null" &&
      sellerStoreName &&
      sellerStoreName !== "null"
    ) {
      return (
        <Link to={`/store/${sellerStoreId}`} id="store_link">
          <p>{sellerStoreName}</p>
        </Link>
      );
    } else {
      return (
        <Link to="/seller">
          <p>Start Selling</p>
        </Link>
      );
    }
  };

  return (
    <nav className="navbar navbar-light bg-white shadow w-100 fixed-top">
      <div className="container-fluid">
        <Link to="/products">
          <img
            src={remLogo}
            alt="Logo"
            width="50"
            height="50"
            className="d-inline-block align-text-top"
          />
        </Link>

        <div className="auth-cart-container text-end">
          {username ? (
            <div className="user-logout-container">
              <button onClick={toggleMenu} className="mb-0" id="btn_username">
                {username}!
              </button>

              {isMenuOpen && (
                <div id="menu" className="floating-menu">
                  <Link to="/profile">
                    <p>My Profile</p>
                  </Link>
                  {renderSellerSection()}
                  <button
                    onClick={handleLogoutClick}
                    className="btn btn-sm ms-3"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <p className="mb-0">
              <span
                className="text-dark cursor-pointer"
                onClick={handleLoginClick}
              >
                Login
              </span>
              <span className="mx-2">|</span>
              <Link to="/signup" className="text-decoration-none text-dark">
                Signup
              </Link>
            </p>
          )}

          <div className="search-cart-container d-flex align-items-center">
            <div className="search-container">
              <input
                type="text"
                placeholder="Search..."
                className="search-input"
                value={searchQuery}
                onChange={handleSearchChange}
                aria-label="Search"
              />
              <FontAwesomeIcon
                icon={faMagnifyingGlass}
                style={{ fontSize: "20px", marginLeft: "10px" }}
                aria-hidden="true"
              />
            </div>
            <Link to="/add_to_cart" aria-label="View Cart">
              <FontAwesomeIcon
                icon={faShoppingCart}
                style={{
                  fontSize: "25px", // Increase the size
                  color: "black", // Change the color
                  marginLeft: "15px", // Adjust margin if needed
                  cursor: "pointer", // Make it clickable
                  transition: "color 0.3s", // Add smooth transition on hover
                }}
                aria-hidden="true"
              />
            </Link>
          </div>
        </div>
      </div>
      <style jsx>{`
        .navbar.fixed-top {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
        }
      `}</style>
    </nav>
  );
};

export default Nav;
