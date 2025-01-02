import React from "react";
import successWebp from "../assets/failed.webp"; // Make sure to adjust the path to your .webp file

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
        src={successWebp}
        alt="Success"
        style={{ width: "200px", height: "auto" }}
      />
      <h1 style={{ marginTop: "20px" }}>Payment Failed.</h1>
    </div>
  );
};

export default SuccessPage;
