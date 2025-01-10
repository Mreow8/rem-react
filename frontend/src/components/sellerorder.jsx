import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SellerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Get sellerId from localStorage
  const sellerId = localStorage.getItem("sellerStoreId");

  useEffect(() => {
    if (sellerId) {
      // Fetch orders for the seller using the sellerId
      axios
        .get(`https://rem-reacts.onrender.com/api/orders/seller/${sellerId}`)
        .then((response) => {
          setOrders(response.data.orders);
          setLoading(false);
        })
        .catch((err) => {
          setError("Error fetching orders");
          setLoading(false);
        });
    } else {
      setError("Seller ID is not available");
      setLoading(false);
    }
  }, [sellerId]);

  if (loading) {
    return <p>Loading orders...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h1>Seller Orders</h1>
      {orders.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Created At</th>
              <th>Payment Method</th>
              <th>Shipping Fee</th>
              <th>Total Amount</th>
              <th>Product Name</th>
              <th>Quantity</th>
              <th>Customer Name</th>
              <th>Address</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.order_id}>
                <td>{order.order_id}</td>
                <td>{new Date(order.created_at).toLocaleDateString()}</td>
                <td>{order.payment_method}</td>
                <td>{order.shipping_fee}</td>
                <td>{order.total_amount}</td>
                <td>{order.product_name}</td>
                <td>{order.quantity}</td>
                <td>{order.customer_name}</td>
                <td>{`${order.address_line}, ${order.city}, ${order.postal_code}`}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No orders found for this seller.</p>
      )}
    </div>
  );
};

export default SellerOrders;
