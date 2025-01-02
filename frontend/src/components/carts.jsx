import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import "../css/carts.css";
import Nav from "./nav";
//import Swal from "sweetalert2";
import remLogo from "../assets/remlogo.png";

const Navbar = () => {
  const [username, setUsername] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const [checkedItems, setCheckedItems] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }

    const userId = localStorage.getItem("userId");
    if (userId) {
      fetchCartItems(userId);
      console.log(userId);
    } else {
      setLoading(false);
    }
  }, []);

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

  useEffect(() => {
    const storedCheckedItems = localStorage.getItem("checkedItems");
    if (storedCheckedItems) {
      setCheckedItems(JSON.parse(storedCheckedItems));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("userId");
    setUsername(null);
    setCartItems([]);
    alert("Logged out successfully!");
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const groupBySeller = (items) => {
    return items.reduce((acc, item) => {
      if (!acc[item.seller_username]) {
        acc[item.seller_username] = [];
      }
      acc[item.seller_username].push(item);
      return acc;
    }, {});
  };

  const groupedCartItems = groupBySeller(cartItems);

  const handleSellerCheckboxChange = (seller, isChecked) => {
    const updatedCheckedItems = { ...checkedItems };
    groupedCartItems[seller].forEach((item) => {
      updatedCheckedItems[`${seller}-${item.product_id}`] = isChecked;
    });
    setCheckedItems(updatedCheckedItems);
    localStorage.setItem("checkedItems", JSON.stringify(updatedCheckedItems));

    // Store the checked product IDs and quantities in localStorage
    const cartData = JSON.parse(localStorage.getItem("cartItems")) || {};
    if (isChecked) {
      groupedCartItems[seller].forEach((item) => {
        cartData[item.product_id] = { quantity: item.quantity };
      });
    } else {
      groupedCartItems[seller].forEach((item) => {
        delete cartData[item.product_id]; // Remove from cart if unchecked
      });
    }
    localStorage.setItem("cartItems", JSON.stringify(cartData)); // Save to localStorage
  };

  const removeCheckedItems = async () => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      console.error("User ID is missing");
      return;
    }

    const checkedItemIds = Object.keys(checkedItems).filter(
      (key) => checkedItems[key]
    );

    for (const itemId of checkedItemIds) {
      let [, productId] = itemId.split("-");
      productId = productId.split(":")[0]; // Keep only the part before ":"

      await removeCartItem(productId);
    }
  };

  const handleGlobalCheckboxChange = (isChecked) => {
    const updatedCheckedItems = {};
    cartItems.forEach((item) => {
      updatedCheckedItems[`${item.seller_username}-${item.product_id}`] =
        isChecked;
    });
    setCheckedItems(updatedCheckedItems);
    localStorage.setItem("checkedItems", JSON.stringify(updatedCheckedItems));

    // Store all the product IDs and quantities in localStorage when checking/unchecking all items
    const cartData = JSON.parse(localStorage.getItem("cartItems")) || {};
    cartItems.forEach((item) => {
      if (isChecked) {
        cartData[item.product_id] = { quantity: item.quantity };
      } else {
        delete cartData[item.product_id];
      }
    });
    localStorage.setItem("cartItems", JSON.stringify(cartData)); // Save to localStorage
  };

  const isSellerFullyChecked = (seller) => {
    return groupedCartItems[seller].every(
      (item) => checkedItems[`${seller}-${item.product_id}`]
    );
  };

  const handleProductCheckboxChange = (seller, productId, isChecked) => {
    const updatedCheckedItems = { ...checkedItems };
    updatedCheckedItems[`${seller}-${productId}`] = isChecked;
    setCheckedItems(updatedCheckedItems);
    localStorage.setItem("checkedItems", JSON.stringify(updatedCheckedItems));

    // Store the checked product IDs and quantities in localStorage
    const cartData = JSON.parse(localStorage.getItem("cartItems")) || {};
    if (isChecked) {
      const item = cartItems.find((item) => item.product_id === productId);
      cartData[productId] = { quantity: item.quantity };
    } else {
      delete cartData[productId]; // Remove from cart if unchecked
    }
    localStorage.setItem("cartItems", JSON.stringify(cartData)); // Save to localStorage
  };

  const isAllItemsChecked = () => {
    return cartItems.every(
      (item) => checkedItems[`${item.seller_username}-${item.product_id}`]
    );
  };

  const getCheckedItemsDetails = () => {
    return cartItems.filter(
      (item) => checkedItems[`${item.seller_username}-${item.product_id}`]
    );
  };

  const calculateCheckedItemsTotal = () => {
    const checkedItemsDetails = getCheckedItemsDetails();
    return checkedItemsDetails.reduce((total, item) => {
      return total + item.product_price * item.quantity;
    }, 0);
  };

  const calculateTotalQuantity = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };
  const increaseQuantity = async (productId) => {
    const userId = localStorage.getItem("userId"); // Retrieve userId from localStorage
    if (!userId) {
      console.error("User ID is missing");
      return;
    }

    const itemToUpdate = cartItems.find(
      (item) => item.product_id === productId
    );
    if (!itemToUpdate) return;

    const newQuantity = itemToUpdate.quantity + 1;
    const success = await updateCartItemQuantity(
      userId,
      productId,
      newQuantity
    );
    if (success) {
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.product_id === productId
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    }
  };

  const decreaseQuantity = async (productId) => {
    const userId = localStorage.getItem("userId"); // Retrieve userId from localStorage
    if (!userId) {
      console.error("User ID is missing");
      return;
    }

    const itemToUpdate = cartItems.find(
      (item) => item.product_id === productId
    );
    if (!itemToUpdate || itemToUpdate.quantity <= 1) return;

    const newQuantity = itemToUpdate.quantity - 1;
    const success = await updateCartItemQuantity(
      userId,
      productId,
      newQuantity
    );
    if (success) {
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.product_id === productId
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    }
  };
  const updateCartItemQuantity = async (userId, productId, quantity) => {
    try {
      const response = await fetch("https://rem-reacts.onrender.com/api/cart", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
          product_id: productId,
          quantity,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update quantity");
      }

      const data = await response.json();
      console.log(data.message);
      return true;
    } catch (error) {
      console.error("Error updating cart item quantity:", error);
      return false;
    }
  };
  const removeCartItem = async (productId) => {
    const userId = localStorage.getItem("userId");

    console.log("Removing product with ID:", productId);

    if (!userId) {
      console.error("User ID is missing");
      return;
    }
    try {
      const response = await fetch(
        `https://rem-reacts.onrender.com/api/cart/${userId}/${productId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to remove item from cart");
      }

      fetchCartItems(userId);
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
  };

  const totalAmount = calculateCheckedItemsTotal();
  const totalQuantity = calculateTotalQuantity();

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
      <div className="fixed-bottom-bar">
        <input
          type="checkbox"
          className="check"
          checked={isAllItemsChecked()}
          onChange={(e) => handleGlobalCheckboxChange(e.target.checked)}
        />
        <button onClick={removeCheckedItems} className="delete-button">
          <FontAwesomeIcon icon={faTrash} style={{ fontSize: "20px" }} />
        </button>

        <p>Total: Php {totalAmount.toFixed(2)}</p>
        <p>Items in Cart: {totalQuantity}</p>
        <Link to="/checkout">
          <button>Checkout</button>
        </Link>
      </div>

      <div className="container-fluid p-0">
        <div className="row justify-content-center">
          <div>
            <div className="cartContainer">
              <div className="details_cart">
                <p className="products">Products</p>
                <p>Price</p>
                <p>Quantity</p>
                <p>Action</p>
              </div>
              <div className="cart_items">
                {loading ? (
                  <p>Loading cart items...</p>
                ) : error ? (
                  <p className="text-danger">{error}</p>
                ) : Object.keys(groupedCartItems).length > 0 ? (
                  Object.keys(groupedCartItems).map((seller) => (
                    <div key={seller}>
                      <div className="sellers_username">
                        <div className="seller">
                          <input
                            className="check"
                            type="checkbox"
                            checked={isSellerFullyChecked(seller)}
                            onChange={(e) =>
                              handleSellerCheckboxChange(
                                seller,
                                e.target.checked
                              )
                            }
                          />
                          <p className="username">{seller}</p>
                        </div>
                        {groupedCartItems[seller].map((item) => (
                          <div
                            key={`${seller}-${item.product_id}`}
                            className="product-card"
                          >
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                              }}
                              className="productsss"
                            >
                              <input
                                type="checkbox"
                                checked={
                                  checkedItems[`${seller}-${item.product_id}`]
                                }
                                onChange={(e) =>
                                  handleProductCheckboxChange(
                                    seller,
                                    item.product_id,
                                    e.target.checked
                                  )
                                }
                              />
                              <img
                                src={item.product_image}
                                alt={item.product_name}
                                style={{
                                  width: "80px",
                                  height: "100px",
                                  objectFit: "cover",
                                  borderRadius: "5px",
                                }}
                                className="image-product"
                              />
                              <p className="product-name">
                                {item.product_name}
                              </p>
                            </div>
                            <p>Php {item.product_price}</p>
                            <div className="quantity">
                              <button
                                className="minus-button"
                                onClick={() =>
                                  decreaseQuantity(item.product_id)
                                }
                              >
                                -
                              </button>
                              <span>{item.quantity}</span>
                              <button
                                className="plus-button"
                                onClick={() =>
                                  increaseQuantity(item.product_id)
                                }
                              >
                                +
                              </button>
                            </div>
                            <button
                              className="delete-button"
                              onClick={() => removeCartItem(item.product_id)}
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No items in your cart</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
