import React, { useState, useEffect } from "react";
import "../css/checkout.css";

const Checkout = ({ cartItems, totalAmount }) => {
  const [userDetails, setUserDetails] = useState({
    name: "",
    address: "",
    phone: "",
  });
  const [checkedOutItems, setCheckedOutItems] = useState([]);

  useEffect(() => {
    // Filter items that are checked for checkout
    const storedCheckedItems =
      JSON.parse(localStorage.getItem("checkedItems")) || {};
    const filteredItems = cartItems.filter(
      (item) => storedCheckedItems[`${item.seller_username}-${item.product_id}`]
    );
    setCheckedOutItems(filteredItems);
  }, [cartItems]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserDetails({ ...userDetails, [name]: value });
  };

  const handleOrderConfirmation = () => {
    if (!userDetails.name || !userDetails.address || !userDetails.phone) {
      alert("Please fill in all the required details.");
      return;
    }

    // Simulate order placement
    alert("Order placed successfully!");
    localStorage.removeItem("checkedItems");
    // Clear localStorage and redirect to home or orders page
    window.location.href = "/";
  };

  return (
    <div className="checkout-container">
      <h1>Checkout</h1>
      <div className="checkout-details">
        <div className="items-summary">
          <h2>Order Summary</h2>
          {checkedOutItems.length > 0 ? (
            checkedOutItems.map((item) => (
              <div key={item.product_id} className="checkout-item">
                <img
                  src={item.product_image}
                  alt={item.product_name}
                  className="checkout-item-image"
                />
                <div className="checkout-item-details">
                  <p>{item.product_name}</p>
                  <p>
                    {item.quantity} x Php {item.product_price}
                  </p>
                  <p>Total: Php {item.quantity * item.product_price}</p>
                </div>
              </div>
            ))
          ) : (
            <p>No items selected for checkout</p>
          )}
          <h3>Total Amount: Php {totalAmount.toFixed(2)}</h3>
        </div>

        <div className="user-details">
          <h2>Shipping Information</h2>
          <form>
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={userDetails.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="address">Address</label>
              <textarea
                id="address"
                name="address"
                value={userDetails.address}
                onChange={handleInputChange}
                required
              ></textarea>
            </div>
            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="text"
                id="phone"
                name="phone"
                value={userDetails.phone}
                onChange={handleInputChange}
                required
              />
            </div>
          </form>
        </div>
      </div>

      <button className="confirm-button" onClick={handleOrderConfirmation}>
        Confirm Order
      </button>
    </div>
  );
};

export default Checkout;
