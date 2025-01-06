import React, { useEffect, useState } from "react";
import "../css/checkout.css";
import Loading from "./loading"; // Assuming you have a loading component
import { useNavigate } from "react-router-dom";

const Checkout = () => {
  const navigate = useNavigate(); // Initialize useNavigate for navigation

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [groupedProducts, setGroupedProducts] = useState({});
  const [totalAmount, setTotalAmount] = useState(0);
  const [shippingFee, setShippingFee] = useState(0); // Shipping fee is initially 0
  const [address, setAddress] = useState(null); // Store the full address object
  const [paymentMethod, setPaymentMethod] = useState("Credit Card");
  const [isAddressModalVisible, setIsAddressModalVisible] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [sellerRegion, setSellerRegion] = useState(""); // Store seller's region

  const shippingRates = [
    { from_region: "Luzon", to_region: "Luzon", shipping_fee: 90.0 },
    { from_region: "Luzon", to_region: "Visayas", shipping_fee: 120.0 },
    { from_region: "Luzon", to_region: "Mindanao", shipping_fee: 150.0 },
    { from_region: "Visayas", to_region: "Luzon", shipping_fee: 120.0 },
    { from_region: "Visayas", to_region: "Visayas", shipping_fee: 90.0 },
    { from_region: "Visayas", to_region: "Mindanao", shipping_fee: 150.0 },
    { from_region: "Mindanao", to_region: "Luzon", shipping_fee: 150.0 },
    { from_region: "Mindanao", to_region: "Visayas", shipping_fee: 150.0 },
    { from_region: "Mindanao", to_region: "Mindanao", shipping_fee: 90.0 },
  ];

  const calculateShippingFee = (buyerRegion, sellerRegion) => {
    const shippingRate = shippingRates.find(
      (rate) =>
        rate.from_region === sellerRegion && rate.to_region === buyerRegion
    );
    return shippingRate ? shippingRate.shipping_fee : 0;
  };

  const handlePlaceOrder = async () => {
    if (!address) {
      alert("Please select an address before placing an order.");
      return;
    }
    const orderData = {
      products: products.map((product) => ({
        product_id: product.product_id,
        quantity: product.quantity,
      })),
      address_id: address.address_id,
      payment_method: paymentMethod,
      shipping_fee: shippingFee,
      total_amount: totalAmount + shippingFee,
    };

    try {
      const response = await saveOrder(orderData);
      console.log("Order saved successfully:", response);
      alert("Order placed successfully!");
      navigate("/success"); // Redirect to an orders page after successful placement
    } catch (error) {
      console.error("Error placing order:", error);
      alert(`Failed to place order: ${error.message || error}`);
    }
  };

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

          if (product.store_region) {
            setSellerRegion(product.store_region);
          }
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
  const saveOrder = async (orderData) => {
    try {
      const response = await fetch(
        "https://rem-reacts.onrender.com/api/orders",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(orderData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to place order");
      }

      return await response.json();
    } catch (error) {
      throw new Error(
        error.message || "An error occurred while placing the order"
      );
    }
  };

  useEffect(() => {
    if (address && sellerRegion) {
      const calculatedFee = calculateShippingFee(address.region, sellerRegion);
      setShippingFee(calculatedFee);
    }
  }, [address, sellerRegion]);

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

  // Function to handle the "Add Address" button click
  const handleAddAddressClick = () => {
    navigate("/profile"); // Redirect to profile page where user can add an address
  };

  if (loading) {
    return <Loading />; // Show loading component if data is still being fetched
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
          <button onClick={handlePlaceOrder} className="checkout-button">
            Place Order
          </button>
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
            <button onClick={handleAddAddressClick}>Add Address</button>{" "}
            {/* Button to redirect to profile */}
            <button onClick={handleAddressModalClose}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
