import React, { useEffect, useState } from "react";
import "../css/checkout.css";

const Checkout = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const localCartItems = JSON.parse(localStorage.getItem("cartItems"));

    if (!localCartItems || Object.keys(localCartItems).length === 0) {
      setCartItems([]);
      setLoading(false);
      return;
    }

    const fetchProductDetails = async () => {
      try {
        const promises = Object.keys(localCartItems).map(async (productId) => {
          const response = await fetch(
            `https://rem-reacts.onrender.com/api/products/${productId}`
          );
          if (!response.ok) {
            throw new Error("Failed to fetch product details");
          }
          const productData = await response.json();
          return {
            ...productData,
            quantity: localCartItems[productId].quantity,
          };
        });

        const products = await Promise.all(promises);
        setCartItems(products);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, []);

  const calculateTotalAmount = () => {
    return cartItems.reduce((total, item) => {
      return total + item.product_price * item.quantity;
    }, 0);
  };

  return (
    <div className="checkout-container">
      <h1>Checkout</h1>
      {loading ? (
        <p>Loading cart items...</p>
      ) : error ? (
        <p className="text-danger">{error}</p>
      ) : cartItems.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <div>
          <div className="checkout-items">
            {cartItems.map((item) => (
              <div key={item.product_id} className="checkout-item">
                <img
                  src={item.product_image}
                  alt={item.product_name}
                  className="product-image"
                />
                <div className="item-details">
                  <h4>{item.product_name}</h4>
                  <p>Seller: {item.seller_username}</p>
                  <p>Price: Php {item.product_price.toFixed(2)}</p>
                  <p>Quantity: {item.quantity}</p>
                  <p>
                    Subtotal: Php{" "}
                    {(item.product_price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="checkout-summary">
            <h2>Total Amount: Php {calculateTotalAmount().toFixed(2)}</h2>
            <button className="checkout-button">Place Order</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
