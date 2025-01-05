import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Nav from "./nav";
import "../css/seller_profile.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import AddProductForm from "./addproducts";

const Shop = () => {
  const { id } = useParams(); // Store ID
  const [products, setProducts] = useState([]);
  const [seller, setSeller] = useState(null); // To hold seller information
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddProductForm, setShowAddProductForm] = useState(false);
  const navigate = useNavigate();

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

        // Assuming the backend returns the seller info and products together
        setSeller(data.seller); // Set the seller information
        setProducts(data.products); // Set the list of products
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

  const openShop = () => {
    if (seller && seller.store_id) {
      navigate(`/sellerprofile/${seller.store_id}`);
    } else {
      alert("Seller ID is missing!");
    }
  };

  return (
    <div className="store-container">
      <Nav />
      {seller && (
        <div className="seller-info">
          <img
            src={seller.seller_image || "placeholder_seller_image.png"}
            alt={seller.store_name}
            className="seller-image"
          />
          <h2 className="seller-name">{seller.store_name}</h2>
          <p>
            {seller.region}, {seller.province}
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
            products.map((product) => (
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
