import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom"; // Import useLocation
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import "../css/carts.css";
import remLogo from "../assets/remlogo.png";

const Navbar = () => {
  const [username, setUsername] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const [checkedItems, setCheckedItems] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const location = useLocation(); // Get the current route location

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }

    const userId = localStorage.getItem("userId");

    // Only fetch cart items on 'carts' or 'checkout' pages
    if (
      userId &&
      (location.pathname === "/carts" || location.pathname === "/checkout")
    ) {
      fetchCartItems(userId);
    } else {
      setLoading(false);
    }
  }, [location.pathname]); // Re-run when the route changes

  const fetchCartItems = async (userId) => {
    try {
      const response = await fetch(
        `https://rem-reacts.onrender.com/api/cart/${userId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch cart items");
      }
      const data = await response.json();
      setCartItems(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("userId");
    setUsername(null);
    setCartItems([]);
    alert("Logged out successfully!");
  };

  const calculateCheckedItemsTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.product_price * item.quantity,
      0
    );
  };

  const totalAmount = calculateCheckedItemsTotal();
  const totalQuantity = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <div className="add-to-cart-container">
      <nav className="navbar navbar-light bg-white shadow w-100 fixed-top">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            <img
              src={remLogo}
              alt="Logo"
              width="60"
              height="60"
              className="d-inline-block align-text-top"
            />
          </a>
        </div>
      </nav>
      {(location.pathname === "/carts" ||
        location.pathname === "/checkout") && (
        <div className="fixed-bottom-bar">
          <p>Total: Php {totalAmount.toFixed(2)}</p>
          <p>Items in Cart: {totalQuantity}</p>
          <Link to="/checkout">
            <button>Checkout</button>
          </Link>
        </div>
      )}
      {(location.pathname === "/carts" ||
        location.pathname === "/checkout") && (
        <div className="container-fluid p-0">
          <div className="row justify-content-center">
            <div>
              <div className="cartContainer">
                {loading ? (
                  <p>Loading cart items...</p>
                ) : error ? (
                  <p className="text-danger">{error}</p>
                ) : cartItems.length > 0 ? (
                  cartItems.map((item) => (
                    <div key={item.product_id} className="product-card">
                      <p>{item.product_name}</p>
                      <p>Php {item.product_price}</p>
                      <p>Quantity: {item.quantity}</p>
                    </div>
                  ))
                ) : (
                  <p>No items in your cart</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
