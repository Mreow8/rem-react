import React, { useEffect, useState } from "react";
import "../css/checkout.css";

const Checkout = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [groupedProducts, setGroupedProducts] = useState({});
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
        groupProductsBySeller(fetchedProducts);
        calculateTotalAmount(fetchedProducts);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, []);

  const groupProductsBySeller = (products) => {
    const grouped = products.reduce((acc, product) => {
      const seller = product.seller_username;
      if (!acc[seller]) {
        acc[seller] = [];
      }
      acc[seller].push(product);
      return acc;
    }, {});
    setGroupedProducts(grouped);
  };

  const calculateTotalAmount = (items) => {
    const total = items.reduce((sum, item) => {
      const price = Number(item.product_price) || 0;
      return sum + price * item.quantity;
    }, 0);
    setTotalAmount(total);
  };

  const calculateSellerTotal = (products) => {
    return products.reduce((sum, product) => {
      const price = Number(product.product_price) || 0;
      return sum + price * product.quantity;
    }, 0);
  };

  return (
    <div className="checkout-container">
      <h1>Checkout</h1>
      {loading ? (
        <p>Loading products...</p>
      ) : error ? (
        <p className="text-danger">{error}</p>
      ) : Object.keys(groupedProducts).length === 0 ? (
        <p>No items in your cart</p>
      ) : (
        <div className="checkout-items">
          {Object.keys(groupedProducts).map((seller) => (
            <div key={seller} className="seller-group">
              <h2>Seller: {seller}</h2>
              {groupedProducts[seller].map((product) => (
                <div key={product.product_id} className="checkout-item">
                  <img
                    src={product.product_image}
                    alt={product.product_name}
                    className="product-image"
                  />
                  <div className="product-details">
                    <p className="product-name">{product.product_name}</p>
                    <p>
                      Price: Php{" "}
                      {(Number(product.product_price) || 0).toFixed(2)}
                    </p>
                    <p>Quantity: {product.quantity}</p>
                    <p>
                      Subtotal: Php{" "}
                      {(
                        Number(product.product_price) * product.quantity
                      ).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
              <p className="seller-total">
                Seller Subtotal: Php{" "}
                {calculateSellerTotal(groupedProducts[seller]).toFixed(2)}
              </p>
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
