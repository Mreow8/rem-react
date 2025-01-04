import React, { useState, useEffect } from "react";
import "../css/nav.css";
import { Link, useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    setUsername(storedUsername);

    // Fetch seller data if the user is logged in
    if (storedUsername) {
      const userId = localStorage.getItem("userId");
      console.log("userId", userId);
      const fetchSellerData = async () => {
        try {
          const response = await fetch(
            `https://rem-reacts.onrender.com/api/sellers/${userId}`
          );
          if (response.ok) {
            const data = await response.json();
            setSellerStoreName(data.store_name);
            setSellerStoreId(data.store_id);
          } else {
            console.error("Failed to fetch seller data");
          }
        } catch (error) {
          console.error("Error fetching seller data:", error);
        }
      };

      fetchSellerData();
    }

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
    if (!username) {
      navigate("/login"); // Navigate to login if not logged in
    }
  };

  const renderSellerSection = () => {
    if (sellerStoreId && sellerStoreName) {
      return (
        <Link to={`/sellerprofile/${sellerStoreId}`} id="store_link">
          <p>{sellerStoreName}</p>
        </Link>
      );
    } else {
      return (
        <Link to="/seller">
          <p style={{ fontSize: "15px" }}>Start Selling</p>
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

        <div className="auth-cart-container d-flex align-items-center justify-content-end">
          {username ? (
            <div className="user-logout-container">
              <button onClick={toggleMenu} className="mb-0" id="btn_username">
                {username}
              </button>

              {isMenuOpen && (
                <div id="menu" className="floating-menu">
                  <Link to="/profile">
                    <p style={{ fontSize: "15px" }}>My Profile</p>
                  </Link>
                  {renderSellerSection()}
                  <p
                    className="logout-section mb-0"
                    style={{ fontSize: "15px" }}
                  >
                    <span
                      className="text-dark cursor-pointer"
                      onClick={handleLogoutClick}
                    >
                      Logout
                    </span>
                  </p>
                </div>
              )}
            </div>
          ) : (
            <p className="login-sign mb-0" style={{ fontSize: "12px" }}>
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

          <div className="search-cart-container d-flex align-items-center ms-3">
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
                  fontSize: "25px",
                  color: "black",
                  marginLeft: "15px",
                  cursor: "pointer",
                  transition: "color 0.3s",
                }}
                aria-hidden="true"
              />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
