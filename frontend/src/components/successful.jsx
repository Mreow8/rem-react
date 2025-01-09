import React from "react";
import successGif from "../assets/successful.gif"; // Make sure to adjust the path to your gif file
import { Link } from "react-router-dom";

const SuccessPage = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <img
        src={successGif}
        alt="Success"
        style={{ width: "200px", height: "auto" }}
      />
      <h1 style={{ marginTop: "20px" }}>Order Placed!.</h1>
      <button>
        <Link to="/profile?tab=orders">Check Orders</Link>
        Check Orders
      </button>
    </div>
  );
};

export default SuccessPage;
