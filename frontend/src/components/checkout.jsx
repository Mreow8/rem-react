import React, { useEffect, useState } from "react";
import "../css/checkout.css";
import Loading from "./loading"; // Assuming you have a loading component

const Checkout = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [groupedProducts, setGroupedProducts] = useState({});
  const [totalAmount, setTotalAmount] = useState(0);
  const [shippingFee, setShippingFee] = useState(50); // Example shipping fee
  const [address, setAddress] = useState(null); // Store the full address object
  const [paymentMethod, setPaymentMethod] = useState("Credit Card");
  const [isAddressModalVisible, setIsAddressModalVisible] = useState(false);
  const [addresses, setAddresses] = useState([]);

  // Function to calculate seller total
  const calculateSellerTotal = (products) => {
    return products.reduce((sum, product) => {
      const price = Number(product.product_price) || 0;
      return sum + price * product.quantity;
    }, 0);
  };

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
            `https://rem-reacts.onrender.com/api/products/${productId}`
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

    const fetchAddresses = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) return;
      try {
        const response = await fetch(
          `https://rem-reacts.onrender.com/api/addresses/${userId}`
        );
        const data = await response.json();
        setAddresses(data.addresses || []);
        setAddress(data.addresses.length > 0 ? data.addresses[0] : null); // Set the first address by default
      } catch (err) {
        console.error("Error fetching addresses:", err);
      }
    };

    fetchCartItems();
    fetchAddresses();
  }, []);

  const groupProductsBySeller = (products) => {
    const grouped = products.reduce((acc, product) => {
      const seller = product.store_name;
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

  const handlePaymentChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  const handleAddressSelection = (selectedAddress) => {
    setAddress(selectedAddress); // Store the full address object
    setIsAddressModalVisible(false); // Close modal after selection
  };

  const handleAddressModalClose = () => {
    setIsAddressModalVisible(false);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="checkout-container">
      <h1>Checkout</h1>
      <div className="checkout-layout">
        <div className="checkout-items scrollable-section">
          {loading ? (
            <p>Loading products...</p>
          ) : error ? (
            <p className="text-danger">{error}</p>
          ) : Object.keys(groupedProducts).length === 0 ? (
            <p>No items in your cart</p>
          ) : (
            Object.keys(groupedProducts).map((seller) => (
              <div key={seller} className="seller-group">
                <p>Seller: {seller}</p>
                {groupedProducts[seller].map((product) => (
                  <div key={product.product_id} className="checkout-item">
                    <img
                      src={product.product_image}
                      alt={product.product_name}
                      className="product-images"
                    />
                    <div className="product-detailss">
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
            ))
          )}
        </div>

        <div className="checkout-summary checkout-summary-right fixed-section">
          <h1>Total Amount</h1>
          <p>Products Total: Php {totalAmount.toFixed(2)}</p>
          <p>Shipping Fee: Php {shippingFee.toFixed(2)}</p>
          <p>Grand Total: Php {(totalAmount + shippingFee).toFixed(2)}</p>

          <h4>Address</h4>
          <p>
            {address
              ? `${address.full_name}, ${address.barangay}, ${address.city}, ${address.province}, ${address.region} ${address.postal_code}`
              : "No address selected"}
          </p>
          <button onClick={() => setIsAddressModalVisible(true)}>
            Choose Address
          </button>

          <h4>Payment Method</h4>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label>
              <input
                type="radio"
                name="payment-method"
                value="Cash on Delivery"
                checked={paymentMethod === "Cash on Delivery"}
                onChange={handlePaymentChange}
              />
              Cash on Delivery
            </label>
            <label>
              <input
                type="radio"
                name="payment-method"
                value="Online Payment"
                checked={paymentMethod === "Online Payment"}
                onChange={handlePaymentChange}
              />
              Online Payment
            </label>
          </div>

          <p>Selected Payment Method: {paymentMethod}</p>
          <button className="checkout-button">Place Order</button>
        </div>
      </div>

      {/* Address Modal */}
      {isAddressModalVisible && (
        <div className="address-modal">
          <div className="address-modal-content">
            <h4>Select Address</h4>
            {addresses.map((address, index) => (
              <div
                key={index}
                className="address-option"
                onClick={() => handleAddressSelection(address)}
              >
                {address.full_name}, {address.barangay}, {address.city},{" "}
                {address.province}, {address.region}, {address.postal_code}
              </div>
            ))}
            <button onClick={handleAddressModalClose}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
