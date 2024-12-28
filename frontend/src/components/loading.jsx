import React from "react";
import "../css/loading.css"; // Optional: Add custom styles if needed
import loadingGif from "../assets/cat.gif"; // Path to your loading GIF

const Loading = () => {
  return (
    <div className="loading-container">
      <img src={loadingGif} alt="Loading..." className="loading-gif" />
      <p>Loading, please wait...</p>
    </div>
  );
};

export default Loading;
