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
  const [successMessage, setSuccessMessage] = useState(null); // State for success message

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
    console.log("User ID:", storedUserId);
    if (!storedUserId) {
      navigate("/login");
      return;
    }

    try {
      // Log the data being sent in the POST request
      const requestData = {
        user_id: storedUserId,
        product_id: product.id,
        quantity: quantity,
      };
      console.log("Sending data to API:", requestData); // This will print the data to the console

      const response = await fetch("https://rem-reacts.onrender.com/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error("Failed to add item to cart");
      }

      const data = await response.json();
      setSuccessMessage(data.message); // Show success message

      // Hide the message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
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
      navigate(`/sellerprofile/${product.store_id}`); // Navigate to the seller's shop page
    } else {
      alert("Seller ID is missing!");
    }
  };

  return (
    <div className="product-desc-container">
      <Nav username={username} />
      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}
      <div className="desc-con"></div>
      <div className="product-containers">
        <div id="productss">
          {/* Product Details Section */}
          <div className="product-details">
            <div className="card product-card1">
              <img
                src={product.product_image || "placeholder_image.png"}
                alt={product.product_name}
                className="img-fluid"
              />
              <div className="product-card-content">
                <p className="product-title">{product.product_name}</p>
                <p>{product.sold}</p>
                <p className="text-danger">Php {product.product_price}</p>

                <div className="input-group">
                  <p id="quan">Quantity</p>
                  <button id="butt" onClick={decreaseQuantity}>
                    -
                  </button>
                  <input type="text" value={quantity} readOnly />
                  <button id="butt" onClick={increaseQuantity}>
                    +
                  </button>
                </div>
                <div className="button-group">
                  <button onClick={handleAddToCart} className="addto">
                    Add to Cart
                  </button>
                  <button onClick={handleBuyNow} className="buy-now">
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="seller-info">
            <img
              src={product.seller_image || "placeholder_image.png"}
              className="seller-images"
              alt="Seller"
            />
            <div className="seller-info-content">
              <div className="seller-name-location">
                <p className="store-name">{product.store_name}</p>
                <p className="location">{product.province}</p>
              </div>
              <div className="button-group">
                <button onClick={openShop} className="open-shop">
                  Shop
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* Product Description and Synopsis Section */}
        <div className="product-description">
          <div className="card">
            <p>Product Description</p>
            <p style={{ fontSize: "20px" }}>{product.product_dimensions}</p>
          </div>
          <div className="card">
            <p>Product Synopsis</p>
            <p style={{ fontSize: "20px" }}>
              {product.product_synopsis || "No synopsis available."}
            </p>
          </div>
        </div>
      </div>

      {/* Seller Information Section */}
    </div>
  );
};

export default ProductDesc;
