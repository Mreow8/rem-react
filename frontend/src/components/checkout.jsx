import React, { useEffect, useState } from "react";
import "../css/checkout.css";

const Checkout = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [groupedProducts, setGroupedProducts] = useState({});
  const [totalAmount, setTotalAmount] = useState(0);
  const [shippingFee, setShippingFee] = useState(50); // Example shipping fee
  const [address, setAddress] = useState("123 Main St, City, Country");
  const [paymentMethod, setPaymentMethod] = useState("Credit Card");
  const [isAddressFormVisible, setAddressFormVisible] = useState(false);
  const [newAddress, setNewAddress] = useState({
    full_name: "",
    phone_number: "",
    region: "",
    province: "",
    city: "",
    barangay: "",
    postal_code: "",
    label: "Home",
  });

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

    fetchCartItems();
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

  const calculateSellerTotal = (products) => {
    return products.reduce((sum, product) => {
      const price = Number(product.product_price) || 0;
      return sum + price * product.quantity;
    }, 0);
  };

  const handlePaymentChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  const handleAddressChange = (event) => {
    const { name, value } = event.target;
    setNewAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddressSubmit = (event) => {
    event.preventDefault();
    setAddress(
      `${newAddress.full_name}, ${newAddress.barangay}, ${newAddress.city}, ${newAddress.province}, ${newAddress.region} ${newAddress.postal_code}`
    );
    setAddressFormVisible(false); // Hide form after submission
  };

  const toggleAddressForm = () => {
    setAddressFormVisible((prev) => !prev);
  };

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
                <h2>Seller: {seller}</h2>
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
          <p>{address}</p>
          <button onClick={toggleAddressForm}>Edit Address</button>

          {isAddressFormVisible && (
            <div className="address-form">
              <h4>Enter New Address</h4>
              <form onSubmit={handleAddressSubmit}>
                <label>
                  Full Name:
                  <input
                    type="text"
                    name="full_name"
                    value={newAddress.full_name}
                    onChange={handleAddressChange}
                  />
                </label>
                <label>
                  Phone Number:
                  <input
                    type="text"
                    name="phone_number"
                    value={newAddress.phone_number}
                    onChange={handleAddressChange}
                  />
                </label>
                <label>
                  Region:
                  <input
                    type="text"
                    name="region"
                    value={newAddress.region}
                    onChange={handleAddressChange}
                  />
                </label>
                <label>
                  Province:
                  <input
                    type="text"
                    name="province"
                    value={newAddress.province}
                    onChange={handleAddressChange}
                  />
                </label>
                <label>
                  City:
                  <input
                    type="text"
                    name="city"
                    value={newAddress.city}
                    onChange={handleAddressChange}
                  />
                </label>
                <label>
                  Barangay:
                  <input
                    type="text"
                    name="barangay"
                    value={newAddress.barangay}
                    onChange={handleAddressChange}
                  />
                </label>
                <label>
                  Postal Code:
                  <input
                    type="text"
                    name="postal_code"
                    value={newAddress.postal_code}
                    onChange={handleAddressChange}
                  />
                </label>
                <label>
                  Address Label:
                  <select
                    name="label"
                    value={newAddress.label}
                    onChange={handleAddressChange}
                  >
                    <option value="Home">Home</option>
                    <option value="Work">Work</option>
                  </select>
                </label>
                <button type="submit">Save Address</button>
              </form>
            </div>
          )}

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
    </div>
  );
};

export default Checkout;
