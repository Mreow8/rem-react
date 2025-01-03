import React, { useEffect, useState, useMemo, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
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
  const userId = useRef(localStorage.getItem("userId"));
  const location = useLocation();

  // Fetch Cart Items
  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) setUsername(storedUsername);

    if (userId.current) {
      fetchCartItems(userId.current);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchCartItems = async (userId) => {
    try {
      const response = await fetch(
        `https://rem-reacts.onrender.com/api/cart/${userId}`
      );
      if (!response.ok) throw new Error("Failed to fetch cart items");

      const data = await response.json();
      setCartItems(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Clear Cart on Tab Close
  useEffect(() => {
    const clearCartOnExit = () => {
      if (!window.location.pathname.includes("/checkout")) {
        localStorage.removeItem("cartItems");
      }
    };
    window.addEventListener("beforeunload", clearCartOnExit);
    return () => window.removeEventListener("beforeunload", clearCartOnExit);
  }, []);

  // Load Checked Items from LocalStorage
  useEffect(() => {
    const storedCheckedItems = localStorage.getItem("checkedItems");
    if (storedCheckedItems) {
      setCheckedItems(JSON.parse(storedCheckedItems));
    }
  }, []);

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("userId");
    setUsername(null);
    setCartItems([]);
    alert("Logged out successfully!");
  };

  // Group Cart Items by Seller
  const groupedCartItems = useMemo(() => {
    return cartItems.reduce((acc, item) => {
      if (!acc[item.seller_username]) acc[item.seller_username] = [];
      acc[item.seller_username].push(item);
      return acc;
    }, {});
  }, [cartItems]);

  // Handle Checkbox Changes
  const handleSellerCheckboxChange = (seller, isChecked) => {
    const updatedCheckedItems = { ...checkedItems };
    groupedCartItems[seller].forEach((item) => {
      updatedCheckedItems[`${seller}-${item.product_id}`] = isChecked;
    });
    setCheckedItems(updatedCheckedItems);
    localStorage.setItem("checkedItems", JSON.stringify(updatedCheckedItems));
  };

  const handleGlobalCheckboxChange = (isChecked) => {
    const updatedCheckedItems = {};
    cartItems.forEach((item) => {
      updatedCheckedItems[`${item.seller_username}-${item.product_id}`] =
        isChecked;
    });
    setCheckedItems(updatedCheckedItems);
    localStorage.setItem("checkedItems", JSON.stringify(updatedCheckedItems));
  };

  const handleProductCheckboxChange = (seller, productId, isChecked) => {
    const updatedCheckedItems = { ...checkedItems };
    updatedCheckedItems[`${seller}-${productId}`] = isChecked;
    setCheckedItems(updatedCheckedItems);
    localStorage.setItem("checkedItems", JSON.stringify(updatedCheckedItems));
  };

  const isSellerFullyChecked = (seller) =>
    groupedCartItems[seller].every(
      (item) => checkedItems[`${seller}-${item.product_id}`]
    );

  const isAllItemsChecked = () =>
    cartItems.every(
      (item) => checkedItems[`${item.seller_username}-${item.product_id}`]
    );

  const getCheckedItemsDetails = () =>
    cartItems.filter(
      (item) => checkedItems[`${item.seller_username}-${item.product_id}`]
    );

  const calculateCheckedItemsTotal = () =>
    getCheckedItemsDetails().reduce(
      (total, item) => total + item.product_price * item.quantity,
      0
    );

  const calculateTotalQuantity = () =>
    cartItems.reduce((total, item) => total + item.quantity, 0);

  // Update Quantity
  const updateQuantity = async (productId, delta) => {
    if (!userId.current) return;

    const item = cartItems.find((item) => item.product_id === productId);
    if (!item || item.quantity + delta < 1) return;

    const newQuantity = item.quantity + delta;
    try {
      const response = await fetch("https://rem-reacts.onrender.com/api/cart", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId.current,
          product_id: productId,
          quantity: newQuantity,
        }),
      });

      if (!response.ok) throw new Error("Failed to update quantity");

      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.product_id === productId
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  // Remove Item
  const removeCartItem = async (productId) => {
    if (!userId.current) return;

    try {
      await fetch(
        `https://rem-reacts.onrender.com/api/cart/${userId.current}/${productId}`,
        { method: "DELETE" }
      );
      fetchCartItems(userId.current);
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const totalAmount = calculateCheckedItemsTotal();
  const totalQuantity = calculateTotalQuantity();

  return (
    <div className="add-to-cart-container">
      <nav className="navbar navbar-light bg-white shadow w-100 fixed-top">
        <div className="container-fluid">
          <img src={remLogo} alt="Logo" width="60" height="60" />
        </div>
      </nav>

      <div className="fixed-bottom-bar">
        <input
          type="checkbox"
          className="check"
          checked={isAllItemsChecked()}
          onChange={(e) => handleGlobalCheckboxChange(e.target.checked)}
        />
        <button onClick={() => removeCartItem()} className="delete-button">
          <FontAwesomeIcon icon={faTrash} style={{ fontSize: "20px" }} />
        </button>
        <p>Total: Php {totalAmount.toFixed(2)}</p>
        <p>Items in Cart: {totalQuantity}</p>
        <Link to={getCheckedItemsDetails().length > 0 ? "/checkout" : "#"}>
          <button disabled={getCheckedItemsDetails().length === 0}>
            Checkout
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
