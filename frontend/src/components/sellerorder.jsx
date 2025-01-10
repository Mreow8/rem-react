import React, { useEffect, useState } from "react";

const SellerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [sellerId, setSellerId] = useState(null);

  // Fetch the sellerId from localStorage (for example)
  useEffect(() => {
    const storedSellerId = localStorage.getItem("sellerId");
    if (storedSellerId) {
      setSellerId(storedSellerId);
    }
  }, []);

  // Fetch and filter orders based on the sellerId
  useEffect(() => {
    const storedOrders = JSON.parse(localStorage.getItem("orders")) || [];
    const sellerOrders = storedOrders.filter(
      (order) => order.sellerId === sellerId
    );
    setOrders(sellerOrders);
  }, [sellerId]); // Re-run when sellerId changes

  return (
    <div>
      <h1>Seller Orders</h1>
      {sellerId && orders.length > 0 ? (
        <ul>
          {orders.map((order) => (
            <li key={order.id}>{order.orderDetails}</li>
          ))}
        </ul>
      ) : (
        <p>No orders found for this seller.</p>
      )}
    </div>
  );
};

export default SellerOrders;
