import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Nav from "./nav"; // Assuming you have a Nav component
import "../css/seller_profile.css"; // Assuming you have a custom CSS file

const SellerProfile = () => {
  const [sellerData, setSellerData] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchSellerData = async () => {
      const storeId = localStorage.getItem("sellerStoreId");
      if (!storeId) {
        alert("Store ID not found!");
        return;
      }

      try {
        const response = await fetch(
          `https://rem-reacts.onrender.com/api/sellers/${storeId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch seller data.");
        }
        const data = await response.json();
        setSellerData(data);
      } catch (error) {
        console.error("Error fetching seller data:", error);
        alert("Error fetching seller data.");
      }
    };

    const fetchProducts = async () => {
      const storeId = localStorage.getItem("sellerStoreId");
      try {
        const response = await fetch(
          `https://rem-reacts.onrender.com/api/products?store_id=${storeId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch products.");
        }
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
        alert("Error fetching products.");
      }
    };

    fetchSellerData();
    fetchProducts();
  }, []);

  return (
    <div className="seller-profile">
      <Nav />
      <div className="profile-container">
        {sellerData && (
          <div className="profile-info">
            <h2>{sellerData.store_name}</h2>
            <p>{sellerData.store_description}</p>
            <p>Email: {sellerData.email}</p>
            <p>Phone: {sellerData.phone}</p>
            <Link
              to={`/edit-store/${sellerData.store_id}`}
              className="btn btn-primary"
            >
              Edit Store
            </Link>
          </div>
        )}

        <div className="products-list">
          <h3>Products</h3>
          <Link to="/add-product" className="btn btn-success">
            Add New Product
          </Link>
          <ul>
            {products.length > 0 ? (
              products.map((product) => (
                <li key={product._id} className="product-item">
                  <div className="product-details">
                    <h4>{product.product_name}</h4>
                    <p>Price: ${product.product_price}</p>
                    <p>Stock: {product.product_quantity}</p>
                    <p>Category: {product.product_category}</p>
                    <p>Author: {product.product_author}</p>
                  </div>
                  <div className="product-actions">
                    <Link
                      to={`/edit-product/${product._id}`}
                      className="btn btn-warning"
                    >
                      Edit
                    </Link>
                  </div>
                </li>
              ))
            ) : (
              <p>No products found.</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SellerProfile;
