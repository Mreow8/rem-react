import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/products.css";
import Nav from "./nav";
import Loading from "./loading"; // Import Loading component

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const navigate = useNavigate();
  const [sortOrder, setSortOrder] = useState(""); // "" means no sorting initially

  const handlePriceSort = (order) => {
    setSortOrder(order); // Update the sort order
  };

  useEffect(() => {
    // Retrieve the username from localStorage
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productRes, categoryRes] = await Promise.all([
          fetch("https://rem-reacts.onrender.com/api/products"),
          fetch("https://rem-reacts.onrender.com/api/products/categories"),
        ]);
        if (!productRes.ok || !categoryRes.ok) {
          throw new Error("Error fetching data");
        }
        setProducts(await productRes.json());
        setCategories(await categoryRes.json());
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredProducts = products
    .filter(
      (product) =>
        (selectedCategory === "" || product.category === selectedCategory) && // Filter by category
        product.product_name.toLowerCase().includes(searchQuery.toLowerCase()) // Filter by search query
    )
    .sort((a, b) => {
      if (sortOrder === "lowToHigh") {
        return a.product_price - b.product_price; // Ascending order
      } else if (sortOrder === "highToLow") {
        return b.product_price - a.product_price; // Descending order
      }
      return 0; // No sorting
    });

  if (loading) {
    return <Loading />; // Show the Loading screen while data is being fetched
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  const handleCategoryClick = (categoryName) => {
    setSelectedCategory(categoryName); // Set selected category
  };

  return (
    <div className="product-list" style={{ fontFamily: "Roboto, sans-serif" }}>
      <Nav />
      <div className="products-main">
        <div id="categories-container">
          <ul className="categories-list">
            {categories.map((cat, idx) => (
              <li
                key={idx}
                className="category-item"
                onClick={() => handleCategoryClick(cat.name)}
              >
                {cat.name}
              </li>
            ))}
            <li>
              Price
              <select
                className="price-sort-dropdown"
                onChange={(e) => handlePriceSort(e.target.value)}
                style={{ marginLeft: "10px" }}
              >
                <option value="">Sort by</option> {/* Default option */}
                <option value="lowToHigh">Low to High</option>
                <option value="highToLow">High to Low</option>
              </select>
            </li>
          </ul>
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
