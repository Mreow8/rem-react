import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/products.css";
import Nav from "./nav";
import Loading from "./loading";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const navigate = useNavigate();

  const handlePriceSort = (order) => {
    setSortOrder(order);
  };

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productRes = await fetch(
          "https://rem-reacts.onrender.com/api/products"
        );
        if (!productRes.ok) {
          throw new Error("Error fetching data");
        }
        setProducts(await productRes.json());
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredProducts = products
    .filter((product) =>
      product.product_name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOrder === "lowToHigh") {
        return a.product_price - b.product_price;
      } else if (sortOrder === "highToLow") {
        return b.product_price - a.product_price;
      }
      return 0;
    });

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  return (
    <div className="product-lists" style={{ fontFamily: "Roboto, sans-serif" }}>
      <Nav />
      <div className="products-main">
        <div>
          <p style={{ display: "inline-flex", marginTop: "8px" }}>Price</p>
          <select
            className="price-sort-dropdown"
            onChange={(e) => handlePriceSort(e.target.value)}
            style={{ marginLeft: "10px" }}
          >
            <option value="">Sort by</option>
            <option value="lowToHigh">Low to High</option>
            <option value="highToLow">High to Low</option>
          </select>
        </div>

        <div className="container">
          <div className="products-container">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => {
                const imageUrl =
                  product.product_image ||
                  "/path_to_placeholder/placeholder_image.png";

                return (
                  <Link
                    to={`/product_desc/${product.id}`}
                    key={product.id}
                    className="product-item"
                    style={{ textDecoration: "none" }}
                  >
                    <img
                      src={imageUrl}
                      alt={product.product_name || "Product Image"}
                      className="product-image"
                    />
                    <p className="product-name">{product.product_name}</p>
                    <p className="product-price" style={{ color: "#ca2727" }}>
                      Php {product.product_price}
                    </p>
                  </Link>
                );
              })
            ) : (
              <p>No products available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
