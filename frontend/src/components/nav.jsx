import React, { useState, useEffect } from "react";
import "../css/nav.css";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faShoppingCart,
  faBars,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import remLogo from "../assets/remlogo.png";

const Nav = ({
  handleLogout,
  searchQuery,
  handleSearchChange,
  onCategorySelect,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [username, setUsername] = useState(null);
  const [sellerStoreName, setSellerStoreName] = useState(null);
  const [sellerStoreId, setSellerStoreId] = useState(null);
  const [categories, setCategories] = useState([]); // State for categories
  const navigate = useNavigate();

  // Fetch seller data and categories when the component mounts
  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    setUsername(storedUsername);

    if (storedUsername) {
      const userId = localStorage.getItem("sellerStoreId");
      const fetchSellerData = async () => {
        try {
          const response = await fetch(
            `https://rem-reacts.onrender.com/api/sellers/${userId}`
          );
          if (response.ok) {
            const data = await response.json();
            setSellerStoreName(data.store_name);
            setSellerStoreId(data.store_id);
          }
        } catch (error) {
          console.error("Error fetching seller data:", error);
        }
      };

      fetchSellerData();
    }

    // Fetch categories from API
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          `https://rem-reacts.onrender.com/api/products/categories`
        );
        if (response.ok) {
          const data = await response.json();
          setCategories(data); // Set categories once fetched
        } else {
          console.error("Failed to fetch categories");
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories(); // Fetch categories when the component mounts
  }, []); // Empty dependency array ensures the fetch runs only once on mount

  // Handle logout
  const handleLogoutClick = () => {
    localStorage.clear();
    setUsername(null);
    navigate("/login");
  };

  // Toggle menu
  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  // Toggle category modal
  const toggleCategoryModal = () => {
    setIsCategoryModalOpen((prev) => !prev);
  };

  // Render seller section if the seller data is available
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

  // Render categories in the modal
  const renderCategories = () => (
    <div className="modal-overlay">
      <div className="categories-modal">
        <button className="close-modal" onClick={toggleCategoryModal}>
          <FontAwesomeIcon icon={faTimes} />
        </button>
        <ul className="categories-list">
          <li
            className="category-item"
            onClick={() => {
              onCategorySelect("");
              toggleCategoryModal();
            }}
          >
            All Products
          </li>
          {categories.map((cat, idx) => (
            <li
              key={idx}
              className="category-item"
              onClick={() => {
                onCategorySelect(cat.name);
                toggleCategoryModal();
              }}
            >
              {cat.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  // Check if user is logged in
  const userId = localStorage.getItem("userId");

  // Handle cart click
  const handleCartClick = () => {
    const userId = localStorage.getItem("userId"); // Get the latest userId from localStorage
    if (!userId) {
      navigate("/login");
    } else {
      // Proceed to cart if userId exists
      navigate("/add_to_cart");
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
          <button
            className="categories-button"
            onClick={toggleCategoryModal}
            aria-label="Open Categories"
          >
            <FontAwesomeIcon icon={faBars} style={{ fontSize: "20px" }} />
          </button>

          {isCategoryModalOpen && renderCategories()}

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
                onClick={() => navigate("/login")}
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
            <div onClick={handleCartClick}>
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
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
