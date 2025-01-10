// import React, { useEffect, useState } from "react";
// import "../css/order.css";
// import Loading from "./loading";

// const SellerOrders = ({ sellerId }) => {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchOrders = async () => {
//       try {
//         const response = await fetch(
//           `https://rem-reacts.onrender.com/api/orders/seller/${sellerId}`
//         );
//         if (!response.ok) {
//           throw new Error("Failed to fetch orders");
//         }
//         const data = await response.json();

//         if (data.orders) {
//           setOrders(data.orders);
//         } else {
//           setError("No orders found.");
//         }
//       } catch (err) {
//         console.error("Error fetching orders:", err);
//         setError("Error fetching orders.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchOrders();
//   }, [sellerId]);

//   if (loading) {
//     return <Loading />;
//   }

//   if (error) {
//     return <div className="error-message">{error}</div>;
//   }

//   return (
//     <div style={{ padding: "20px" }}>
//       <h2>Orders</h2>
//       <div className="order-list">
//         {orders.length > 0 ? (
//           orders.map((order) => (
//             <div
//               className="order-box"
//               key={order.order_id}
//               style={{ marginBottom: "20px" }}
//             >
//               <h3>Order ID: {order.order_id}</h3>
//               <p>Total Amount: Php {order.total_amount}</p>
//               <p>
//                 Placed on: {new Date(order.created_at).toLocaleDateString()}
//               </p>
//               <p>Payment Method: {order.payment_method}</p>
//               <p>Status: {order.status}</p>
//             </div>
//           ))
//         ) : (
//           <p>No orders available for this store.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default SellerOrders;
