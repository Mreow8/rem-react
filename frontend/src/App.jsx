import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/home";
import Products from "./components/products";
import Signup from "./components/Signup";
import Seller from "./components/sellers";
import Login from "./components/login";
import Product_desc from "./components/product_desc";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />{" "}
        <Route path="/login" element={<Login />} />{" "}
        <Route path="/signup" element={<Signup />} />{" "}
        <Route path="/seller" element={<Seller />} />{" "}
        <Route path="/product_desc/:id" element={<Product_desc />} />{" "}
      </Routes>
    </Router>
  );
};

export default App;
