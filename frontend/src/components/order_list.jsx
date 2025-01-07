import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const userId = localStorage.getItem("userId"); // Assuming user_id is stored in localStorage
        if (!userId) {
          navigate("/login"); // Redirect to login if user is not logged in
          return;
        }

        const response = await fetch(
          `https://rem-reacts.onrender.com/api/orders/${userId}`
        );
        const data = await response.json();

        if (data.orders) {
          setOrders(data.orders);
        } else {
          setError("No orders found.");
        }
      } catch (err) {
        setError("Error fetching orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  const handlePayNow = (orderId) => {
    navigate(`/pay/${orderId}`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>Your Orders</h2>
      <div>
        {orders.length > 0 ? (
          orders.map((order) => (
            <div key={order.order_id} style={{ marginBottom: "20px" }}>
              <h3>Order ID: {order.order_id}</h3>
              <p>Total Amount: Php {order.total_amount}</p>
              <p>
                Placed on: {new Date(order.created_at).toLocaleDateString()}
              </p>
              <p>Payment Method: {order.payment_method}</p>

              {/* Conditionally render the Pay Now button */}
              {order.payment_method === "Online Payment" &&
              order.status === "pending" ? (
                <button onClick={() => handlePayNow(order.order_id)}>
                  Pay Now
                </button>
              ) : (
                <button disabled>Pay Now (COD or Already Paid)</button>
              )}
            </div>
          ))
        ) : (
          <p>No orders available.</p>
        )}
      </div>
    </div>
  );
};

export default OrderList;
