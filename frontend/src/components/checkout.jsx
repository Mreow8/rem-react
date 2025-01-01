import React, { useState, useEffect } from "react";
import "../css/checkout.css";

const Checkout = () => {
  const [userDetails, setUserDetails] = useState({
    name: "",
    address: "",
    phone: "",
  });
  const [checkedOutItems, setCheckedOutItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [cartItems, setCartItems] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const userId = 1; // For example, replace with the actual user ID or fetch it from a session or token
    fetchCartItems(userId);
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
    // Convert cartItems object to an array including the quantity
    const cartItemsArray = Object.keys(cartItems).map((productId) => ({
      product_id: productId,
      quantity: cartItems[productId].quantity,
    }));

    // Log cartItemsArray to ensure the format is correct
    console.log("cartItemsArray:", cartItemsArray);

    // Calculate the total amount
    const total = cartItemsArray.reduce(
      (sum, item) => sum + item.quantity * item.product_price,
      0
    );

    setCheckedOutItems(cartItemsArray);
    setTotalAmount(total);
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
    localStorage.removeItem("cartItems");
    // Redirect to home or orders page
    window.location.href = "/";
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

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
