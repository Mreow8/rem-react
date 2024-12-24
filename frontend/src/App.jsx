import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/home";
import Products from "./components/products"; // Corrected import to use capital "P" for Products

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />{" "}
        {/* Corrected to match component name */}
      </Routes>
    </Router>
  );
};

export default App;
