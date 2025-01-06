const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
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
        (selectedCategory === "" || product.category === selectedCategory) &&
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

  const handleCategoryClick = (categoryName) => {
    if (selectedCategory !== categoryName) {
      setSelectedCategory(categoryName);
      setIsModalOpen(false); // Close the modal after selecting a category
    }
  };

  const handleShowAllClick = () => {
    setSelectedCategory(""); // Reset category filter to show all products
  };

  return (
    <div className="product-lists" style={{ fontFamily: "Roboto, sans-serif" }}>
      <Nav />
      <div className="products-main">
        <div id="categories-container">
          <ul className="categories-list large-screen">
            <li>
              <a
                href="#"
                onClick={handleShowAllClick}
                className="category-item"
              >
                All Products
              </a>
            </li>
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
                <option value="">Sort by</option>
                <option value="lowToHigh">Low to High</option>
                <option value="highToLow">High to Low</option>
              </select>
            </li>
          </ul>

          {/* For small screens */}
          <button
            className="categories-modal-button"
            onClick={() => setIsModalOpen(true)}
          >
            Categories
          </button>

          {isModalOpen && (
            <div className="modal-overlay">
              <div className="categories-modal">
                <button
                  className="close-modal"
                  onClick={() => setIsModalOpen(false)}
                >
                  &times;
                </button>
                <ul className="categories-list">
                  <li>
                    <a
                      href="#"
                      onClick={handleShowAllClick}
                      className="category-item"
                    >
                      All Products
                    </a>
                  </li>
                  {categories.map((cat, idx) => (
                    <li
                      key={idx}
                      className="category-item"
                      onClick={() => handleCategoryClick(cat.name)}
                    >
                      {cat.name}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
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
