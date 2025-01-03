import React, { useEffect, useState } from "react";
import "../css/checkout.css";
import Loading from "./loading"; // Assuming you have a loading component

const AddressForm = ({ onSubmit, onClose }) => {
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

  const handleAddressChange = (event) => {
    const { name, value } = event.target;
    setNewAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddressSubmit = (event) => {
    event.preventDefault();
    onSubmit(newAddress); // Pass the new address to the parent component
    onClose(); // Close the modal after submission
  };

  return (
    <form onSubmit={handleAddressSubmit}>
      <div>
        <label>Full Name</label>
        <input
          type="text"
          name="full_name"
          value={newAddress.full_name}
          onChange={handleAddressChange}
          required
        />
      </div>
      <div>
        <label>Phone Number</label>
        <input
          type="text"
          name="phone_number"
          value={newAddress.phone_number}
          onChange={handleAddressChange}
          required
        />
      </div>
      <div>
        <label>Region</label>
        <input
          type="text"
          name="region"
          value={newAddress.region}
          onChange={handleAddressChange}
          required
        />
      </div>
      <div>
        <label>Province</label>
        <input
          type="text"
          name="province"
          value={newAddress.province}
          onChange={handleAddressChange}
          required
        />
      </div>
      <div>
        <label>City</label>
        <input
          type="text"
          name="city"
          value={newAddress.city}
          onChange={handleAddressChange}
          required
        />
      </div>
      <div>
        <label>Barangay</label>
        <input
          type="text"
          name="barangay"
          value={newAddress.barangay}
          onChange={handleAddressChange}
          required
        />
      </div>
      <div>
        <label>Postal Code</label>
        <input
          type="text"
          name="postal_code"
          value={newAddress.postal_code}
          onChange={handleAddressChange}
          required
        />
      </div>
      <div>
        <label>Address Label (e.g., Home, Office)</label>
        <input
          type="text"
          name="label"
          value={newAddress.label}
          onChange={handleAddressChange}
        />
      </div>
      <button type="submit">Save Address</button>
    </form>
  );
};

const Checkout = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [groupedProducts, setGroupedProducts] = useState({});
  const [totalAmount, setTotalAmount] = useState(0);
  const [shippingFee, setShippingFee] = useState(50); // Example shipping fee
  const [address, setAddress] = useState(null); // Store the full address object
  const [paymentMethod, setPaymentMethod] = useState("Credit Card");
  const [isAddressFormVisible, setAddressFormVisible] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [isAddressModalVisible, setIsAddressModalVisible] = useState(false);

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

  const handleAddressSubmit = (newAddress) => {
    setAddress(newAddress); // Store the full address object
    setAddressFormVisible(false); // Hide form after submission
  };

  const toggleAddressModal = () => {
    setIsAddressModalVisible((prev) => !prev);
  };

  const handleAddressSelection = (selectedAddress) => {
    setAddress(selectedAddress); // Store the full address object
    setIsAddressModalVisible(false); // Close modal after selection
  };

  const handleAddNewAddress = () => {
    setAddressFormVisible(true);
    setIsAddressModalVisible(false); // Close modal
  };

  const handleAddressModalClose = () => {
    setIsAddressModalVisible(false);
  };

  const addAddress = async (newAddress) => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("User not logged in. Cannot add address.");
      return;
    }

    const addressPayload = {
      ...newAddress,
      userId, // Make sure to include the userId
    };

    try {
      const response = await fetch(
        "https://rem-reacts.onrender.com/api/addresses",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(addressPayload),
        }
      );

      if (response.ok) {
        const result = await response.json();
        setAddresses((prevAddresses) => [
          ...prevAddresses,
          { ...addressPayload, id: result.addressId },
        ]);
        alert("Address added successfully!");
        setAddressFormVisible(false); // Close the form modal
      } else {
        const errorData = await response.json();
        alert(`Failed to add address: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error adding address:", error);
      alert("An error occurred while adding the address. Please try again.");
    }
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
          <p>
            {address
              ? `${address.full_name}, ${address.barangay}, ${address.city}, ${address.province}, ${address.region} ${address.postal_code}`
              : "No address selected"}
          </p>
          <button onClick={toggleAddressModal}>Choose Address</button>

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
            <button onClick={handleAddNewAddress}>Add New Address</button>
            <button onClick={handleAddressModalClose}>Close</button>
          </div>
        </div>
      )}

      {/* New Address Form Modal */}
      {isAddressFormVisible && (
        <div className="address-form-modal">
          <div className="address-form-modal-content">
            <AddressForm
              onSubmit={addAddress}
              onClose={handleAddressModalClose}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
