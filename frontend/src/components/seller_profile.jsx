import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom"; // Import Link
import Nav from "./nav";
import "../css/seller_profile.css";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import "bootstrap-icons/font/bootstrap-icons.css";
import AddProductForm from "./addproducts"; // Import the AddProductForm

const Shop = () => {
  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const [seller, setSeller] = useState(null); // To hold seller information
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddProductForm, setShowAddProductForm] = useState(false); // State to show/hide the add product form

  // Fetch seller data from localStorage
  const sellerStoreId = localStorage.getItem("sellerStoreId");
  const sellerStoreName = localStorage.getItem("sellerStoreName");

  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        const response = await fetch(
          `https://rem-reacts.onrender.com/api/products?storeId=${id}` // Fetch products for the specific store
        );
        if (!response.ok) {
          throw new Error("Failed to fetch products.");
        }
        const data = await response.json();

        // Assuming products have seller details
        if (data.length > 0) {
          setSeller({
            name: sellerStoreName || data[0].store_name, // Use sellerStoreName from localStorage or fallback to data[0].store_name
            image: data[0].seller_image || "placeholder_seller_image.png", // Use seller image or placeholder
            region: data[0].region,
            province: data[0].province,
          });
        }

        setProducts(data); // Set the list of products
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStoreData();
  }, [id, sellerStoreId, sellerStoreName]);

  if (loading) {
    return <div className="loading-message">Loading products...</div>;
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  return (
    <div className="store-container">
      <Nav /> {/* Include navigation */}
      {seller && (
        <div className="seller-info">
          <img src={seller.image} alt={seller.name} className="seller-image" />
          <h2 className="seller-name">{seller.name}</h2>
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
      {/* Product List */}
      <div className="product-list">
        <h3>Products</h3>
        <div className="products-container">
          {products.length > 0 ? (
            products.map((product) => {
              return (
                <div key={product.id} className="product-item">
                  {/* Link to product details page */}
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
