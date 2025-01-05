import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Nav from "./nav";
import "../css/seller_profile.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import AddProductForm from "./addproducts";
import ProductDesc from "./product_desc";

const Shop = () => {
  const { id } = useParams(); // Store ID
  const [storeData, setStoreData] = useState(null); // To hold both seller and product data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddProductForm, setShowAddProductForm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        const response = await fetch(
          `https://rem-reacts.onrender.com/api/sellers/${id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch store data.");
        }
        const data = await response.json();
        setStoreData(data); // Set both seller and products
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStoreData();
  }, [id]);

  if (loading) {
    return <div className="loading-message">Loading store data...</div>;
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  const openShop = () => {
    if (storeData && storeData.store_id) {
      navigate(`/sellerprofile/${storeData.store_id}`);
    } else {
      alert("Seller ID is missing!");
    }
  };

  return (
    <div className="store-container">
      <Nav />
      {storeData && (
        <div className="seller-info">
          <img
            src={storeData.seller_image || "placeholder_seller_image.png"}
            alt={storeData.store_name}
            className="seller-image"
          />
          <h2 className="seller-name">{storeData.store_name}</h2>
          <p>
            {storeData.region}, {storeData.province}
          </p>
          <button onClick={() => setShowAddProductForm(true)}>
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
          {storeData && storeData.products && storeData.products.length > 0 ? (
            storeData.products.map((product) => (
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
            <div>
              <p>No products available for this store.</p>
              <button
                onClick={() => setShowAddProductForm(true)}
                className="btn-primary"
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
