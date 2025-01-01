import React, { useEffect, useState } from "react";
import "../css/checkout.css";

const Checkout = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const cartData = JSON.parse(localStorage.getItem("cartItems")) || {};
        const productIds = Object.keys(cartData);

        if (productIds.length === 0) {
          setProducts([]);
          setLoading(false);
          return;
        }

        const fetchedProducts = [];
        for (const productId of productIds) {
          const response = await fetch(
            `https://rem-reacts.onrender.com/api/product/${productId}`
          );
          if (!response.ok) {
            throw new Error(
              `Failed to fetch product details for ID ${productId}`
            );
          }
          const product = await response.json();
          fetchedProducts.push({
            ...product,
            quantity: cartData[productId].quantity,
          });
        }

        setProducts(fetchedProducts);
        calculateTotalAmount(fetchedProducts);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, []);

  const calculateTotalAmount = (items) => {
    const total = items.reduce((sum, item) => {
      const price = Number(item.product_price) || 0;
      return sum + price * item.quantity;
    }, 0);
    setTotalAmount(total);
  };

  return (
    <div className="checkout-container">
      <h1>Checkout</h1>
      {loading ? (
        <p>Loading products...</p>
      ) : error ? (
        <p className="text-danger">{error}</p>
      ) : products.length === 0 ? (
        <p>No items in your cart</p>
      ) : (
        <div className="checkout-items">
          {products.map((product) => (
            <div key={product.product_id} className="checkout-item">
              <img
                src={product.product_image}
                alt={product.product_name}
                className="product-image"
              />
              <div className="product-details">
                <p className="product-name">{product.product_name}</p>
                <p className="seller-name">Seller: {product.seller_username}</p>
                <p>
                  Price: Php {(Number(product.product_price) || 0).toFixed(2)}
                </p>
                <p>Quantity: {product.quantity}</p>
                <p>
                  Subtotal: Php{" "}
                  {(Number(product.product_price) * product.quantity).toFixed(
                    2
                  )}
                </p>
              </div>
            </div>
          ))}
          <div className="checkout-summary">
            <h2>Total Amount: Php {totalAmount.toFixed(2)}</h2>
            <button className="checkout-button">Proceed to Payment</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
