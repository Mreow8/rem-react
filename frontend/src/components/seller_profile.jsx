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
  const { id } = useParams(); // Store ID
  const [storeData, setStoreData] = useState(null); // To hold seller data
  const [productsData, setProductsData] = useState([]); // To hold product data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddProductForm, setShowAddProductForm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedid = localStorage.getItem("sellerStoreId");

    if (!storedid) {
      setError("Seller store ID not found in local storage.");
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
        setError(error.message);
      } finally {
        setLoading(false);
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
        setProductsData(data.products || []); // Assuming the products are inside the `products` field in the response.
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false); // Ensure loading is false
      }
    };

    fetchStoreData();
    fetchProductsData();
  }, []); // Empty dependency array to run once when the component mounts

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
          {productsData && productsData.length > 0 ? (
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
