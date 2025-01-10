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
import Success from "./components/successful";
import Failed from "./components/failed";
import Order_list from "./components/order_list";
import SellerOrders from "./components/SellerOrders";
import Payment from "./components/payment";
import Need from "./components/NeedHelpPage";
import EditProductForm from "./components/EditProductForm";

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
        <Route path="/success" element={<Success />} />
        <Route path="/failed" element={<Failed />} />
        <Route path="/order_list" element={<Order_list />} />
        <Route path="/pay/:orderId" element={<Payment />} />
        <Route path="/need" element={<Need />} />{" "}
        <Route path="/seller/:id/orders" element={<SellerOrders />} />
        <Route path="/edit-product/:id" element={<EditProductForm />} />
      </Routes>
    </Router>
  );
};

export default App;
