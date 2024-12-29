import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom"; // Import Link
import Nav from "./nav";
import "../css/store.css";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import "bootstrap-icons/font/bootstrap-icons.css"; // Import Bootstrap Icons

const Shop = () => {
  const { id } = useParams(); // Retrieve the store ID from the URL
  const [products, setProducts] = useState([]);
  const [seller, setSeller] = useState(null); // To hold seller information
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

        if (data.length > 0) {
          setSeller({
            name: data[0].store_name,
            image: data[0].seller_image || "placeholder_seller_image.png",
            region: data[0].region, // Set region
            province: data[0].province, // Set province
          });
        }

        setProducts(data);
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
      <Nav /> {/* Include navigation */}
      {seller && (
        <div className="seller-info">
          <img
            src={`http://localhost:5000/uploads/${seller.image}`}
            alt={seller.name}
            className="seller-image"
          />
          <h2 className="seller-name">{seller.name}</h2>
          <p>
            {seller.region}, {seller.province}
          </p>
        </div>
      )}
      {/* Product List */}
      <div className="product-list">
        <h3>Products</h3>
        <div className="products-container">
          {products.length > 0 ? (
            products.map((product) => {
              const imageUrl = product.product_image || "placeholder_image.png";

              return (
                <div key={product.id} className="product-item">
                  <Link
                    to={`/product_desc/${product.id}`}
                    className="product-item-link"
                  >
                    <img
                      src={imageUrl}
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
            <p>No products available for this store.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;
