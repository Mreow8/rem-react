import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // Import useParams from react-router-dom

const PaymentPage = () => {
  const { orderId } = useParams(); // Get the orderId from URL params using useParams
  const [paymentLink, setPaymentLink] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPaymentLink = async () => {
      try {
        const response = await fetch(
          `https://rem-react.onrender.com/api/create-payment-link`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              orderId: orderId,
              description: `Payment for Order #${orderId}`,
            }),
          }
        );
        const data = await response.json();
        if (data.paymentLinkUrl) {
          setPaymentLink(data.paymentLinkUrl);
        } else {
          setError("Failed to generate payment link.");
        }
      } catch (err) {
        console.error("Error", err);
        setError("Error generating payment link.");
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentLink();
  }, [orderId]);

  if (loading) {
    return <div>Loading payment page...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h2>Payment for Order #{orderId}</h2>
      {paymentLink ? (
        <a href={paymentLink} target="_blank" rel="noopener noreferrer">
          Proceed to Payment
        </a>
      ) : (
        <p>Unable to generate payment link. Please try again.</p>
      )}
    </div>
  );
};

export default PaymentPage;
