import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/home";
import Products from "./components/products";
import Signup from "./components/Signup";
import Seller from "./components/sellers";
import Login from "./components/login";
import SellerProfile from "./components/seller_profile";
import Product_desc from "./components/product_desc";
import Add_Product from "./components/addproducts";
import Carts from "./components/carts";
import Profile from "./components/profile";
import Checkout from "./components/checkout";

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
        <Route path="/sellerprofile/:id" element={<SellerProfile />} />
        <Route path="/addproducts" element={<Add_Product />} />
        <Route path="/add_to_cart" element={<Carts />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/checkout" element={<Checkout />} />
      </Routes>
    </Router>
  );
};

export default App;
