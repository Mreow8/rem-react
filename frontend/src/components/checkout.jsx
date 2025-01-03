import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom"; // Import useLocation to track the route

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

  const location = useLocation(); // Get the current location/path

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

    // Clear cart when navigating away from the checkout page
    if (location.pathname !== "/checkout") {
      localStorage.removeItem("cartItems");
    }
  }, [location.pathname]); // Trigger the effect on pathname change

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

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="checkout-container">
      <h1>Checkout</h1>
      {/* Your checkout component JSX here */}
    </div>
  );
};

export default Checkout;
