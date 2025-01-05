import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Nav from "./nav";
import "../css/seller_profile.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import AddProductForm from "./addproducts";

const Shop = () => {
  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const [seller, setSeller] = useState(null); // To hold seller information
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddProductForm, setShowAddProductForm] = useState(false);

  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        const response = await fetch(
          `https://rem-reacts.onrender.com/api/products?storeId=${id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch products.");
        }
        const data = await response.json();

        setProducts(data); // Set the list of products
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStoreData();
  }, [id]);

  if (loading) {
    return <div className="loading-message">Loading products...</div>;
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  return (
    <div className="store-container">
      <Nav />
      {seller && (
        <div className="seller-info">
          <img
            src={product.seller_image}
            alt={product.store_name}
            className="seller-image"
          />
          <h2 className="seller-name">{product.store_name}</h2>
          <p>
            {product.region}, {product.province}
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
          {products.length > 0 ? (
            products.map((product) => {
              return (
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
              );
            })
          ) : (
            <div>
              <p>No products available for this store.</p>
              <button
                onClick={() => setShowAddProductForm(true)}
                className="btnss btn-primary"
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
