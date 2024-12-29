import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Nav from "./nav";
import "../css/product_desc.css";
import Loading from "./loading";
const ProductDesc = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [username, setUsername] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }

    const fetchProductDetails = async () => {
      try {
        const response = await fetch(
          `https://rem-reacts.onrender.com/api/products/${id}`
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch product details for ID: ${id}`);
        }
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);

  const increaseQuantity = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  const decreaseQuantity = () => {
    setQuantity((prevQuantity) => (prevQuantity > 1 ? prevQuantity - 1 : 1));
  };

  const handleBuyNow = () => {
    const storedUserId = localStorage.getItem("userId");
    if (!storedUserId) {
      navigate("/login");
      return;
    }
    // Handle Buy Now logic here
  };

  const handleAddToCart = async () => {
    if (!product) return;

    const storedUserId = localStorage.getItem("userId");
    if (!storedUserId) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch("https://rem-reacts.onrender.com/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: storedUserId,
          product_id: product.id,
          quantity: quantity,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add item to cart");
      }

      const data = await response.json();
      alert(data.message);
    } catch (error) {
      console.error(error);
      alert("Error adding item to cart: " + error.message);
    }
  };

  if (loading) {
    return <Loading />; // Show the Loading screen while data is being fetched
  }
  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  if (!product) {
    return <div className="no-product-message">No product found.</div>;
  }
  const handleBackToProducts = () => {
    navigate("/products"); // Navigate to the products page
  };
  const openShop = () => {
    if (product && product.store_id) {
      navigate(`/shop/${product.store_id}`); // Navigate to the seller's shop page
    } else {
      alert("Seller ID is missing!");
    }
  };

  return (
    <div className="product-desc-container">
      <Nav username={username} />
      <div className="product-containers">
        <div id="productss">
          {/* Product Details Section */}
          <div className="product-details">
            <div className="card product-card">
              <img
                src={product.product_image || "placeholder_image.png"}
                alt={product.product_name}
                className="img-fluid"
              />
              <div className="product-card-content">
                <p className="font-size">{product.product_name}</p>
                <p className="text-danger">Php {product.product_price}</p>

                <div className="input-group">
                  <p>Quantity</p>
                  <button onClick={decreaseQuantity}>-</button>
                  <input type="text" value={quantity} readOnly />
                  <button onClick={increaseQuantity}>+</button>
                </div>
                <div className="button-group">
                  <button onClick={handleBuyNow}>Buy Now</button>
                  <button onClick={handleAddToCart}>Add to Cart</button>
                </div>
                <Link to="/products" className="back-to-products">
                  Back to Products
                </Link>
              </div>
            </div>
          </div>
          <div className="seller-info">
            <div className="cards">
              <img
                src={product.seller_image || "placeholder_image.png"}
                className="seller-image"
                alt="Seller"
              />
              <div className="seller-info-content">
                <div className="seller-name-location">
                  <p className="store-name">{product.store_name}</p>
                  <p className="location">{product.province}</p>
                </div>
                <div className="button-group">
                  <button>Message</button>
                  <button onClick={openShop} className="open-shop">
                    Shop
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Product Description and Synopsis Section */}
        <div className="product-description">
          <div className="card">
            <p>Product Description</p>
            <p>{product.product_description}</p>
          </div>
          <div className="card">
            <p>Product Synopsis</p>
            <p>{product.product_synopsis || "No synopsis available."}</p>
          </div>
        </div>
      </div>

      {/* Seller Information Section */}
    </div>
  );
};

export default ProductDesc;
