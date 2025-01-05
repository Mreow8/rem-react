import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Nav from "./nav";
import "../css/seller_profile.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import AddProductForm from "./addproducts";
import ProductDesc from "./product_desc";
import Loading from "./loading";

const Shop = () => {
  const { id } = useParams(); // Store ID from URL params
  const [storeData, setStoreData] = useState(null); // To hold seller data
  const [productsData, setProductsData] = useState([]); // To hold product data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [showAddProductForm, setShowAddProductForm] = useState(false); // Add product form visibility
  const navigate = useNavigate(); // Navigation handler

  useEffect(() => {
    const storedid = id || localStorage.getItem("sellerStoreId"); // Use URL param first, then fallback to localStorage

    if (!storedid) {
      setError("Store ID not found.");
      setLoading(false);
      return;
    }

    // Fetch Seller Information
    const fetchStoreData = async () => {
      try {
        const response = await fetch(
          `https://rem-reacts.onrender.com/api/sellers/${storedid}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch store data.");
        }
        const data = await response.json();
        setStoreData(data);
      } catch (error) {
        console.error("Error fetching store data:", error);
        setError(error.message);
      }
    };

    // Fetch Products Information
    const fetchProductsData = async () => {
      try {
        const response = await fetch(
          `https://rem-reacts.onrender.com/api/sellers/product/${storedid}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch product data.");
        }
        const data = await response.json();
        setProductsData(data.products || []); // Handle empty or missing products gracefully
      } catch (error) {
        console.error("Error fetching product data:", error);
        setError(error.message);
      }
    };

    // Fetch data and handle loading state
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchStoreData(), fetchProductsData()]);
      setLoading(false);
    };

    fetchData();
  }, [id]); // Run every time the store ID changes

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  return (
    <div className="store-container">
      <Nav />
      {storeData && (
        <div className="seller-info">
          <img
            src={storeData.image || "placeholder_seller_image.png"}
            alt={storeData.store_name || "Seller"}
            className="seller-image"
          />
          <h2 className="seller-name">{storeData.store_name}</h2>
          <p>
            {storeData.region}, {storeData.province}
          </p>
          <button
            onClick={() => setShowAddProductForm(true)}
            className="btn btn-primary"
          >
            Add Product
          </button>
        </div>
      )}
      {showAddProductForm && (
        <AddProductForm setShowAddProductForm={setShowAddProductForm} />
      )}
      <div className="product-list">
        <h3>Products</h3>
        <div className="products-container">
          {productsData.length > 0 ? (
            productsData.map((product) => (
              <div key={product.id} className="product-item">
                <Link
                  to={`/product_desc/${product.id}`}
                  className="product-item-link"
                >
                  <img
                    src={product.product_image || "placeholder_image.png"}
                    alt={product.product_name || "Product Image"}
                    className="product-image"
                  />
                  <h4 className="product-name">{product.product_name}</h4>
                  <p className="product-price">Php {product.product_price}</p>
                </Link>
              </div>
            ))
          ) : (
            <div className="no-products">
              <p>No products available for this store.</p>
              <button
                onClick={() => setShowAddProductForm(true)}
                className="btn btn-primary"
              >
                Add Product
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;
