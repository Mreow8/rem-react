import React from "react";
import successGif from "../assets/successful.gif"; // Make sure to adjust the path to your gif file

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
      <h1 style={{ marginTop: "20px" }}>Payment Successful.</h1>
    </div>
  );
};

export default SuccessPage;
