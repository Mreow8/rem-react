import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/addproducts.css"; // Import custom CSS

function EditProductForm({ setShowEditProductForm }) {
  const { id } = useParams(); // Get the product ID from URL
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    product_image: null,
    product_name: "",
    product_price: "",
    product_quantity: "",
    product_author: "",
    product_description: "",
    product_category: "",
    product_publisher: "",
    product_dimensions: "",
    product_weight: "",
    product_pages: "",
  });

  useEffect(() => {
    // Fetch the product details using the product ID
    const fetchProductData = async () => {
      try {
        const response = await fetch(
          `https://rem-reacts.onrender.com/api/products/${id}`
        );
        if (!response.ok) throw new Error("Failed to fetch product data.");
        const data = await response.json();
        setFormData({
          product_name: data.product_name,
          product_price: data.product_price,
          product_quantity: data.product_quantity,
          product_author: data.product_author,
          product_description: data.product_description,
          product_category: data.product_category,
          product_publisher: data.product_publisher,
          product_dimensions: data.product_dimensions,
          product_weight: data.product_weight,
          product_pages: data.product_pages,
          product_image: data.product_image || null, // Handle if there's no image
        });
      } catch (error) {
        console.error("Error fetching product data:", error);
        alert("Error fetching product data.");
      }
    };

    fetchProductData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    setFormData({ ...formData, product_image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.product_name ||
      !formData.product_price ||
      !formData.product_quantity
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    const productData = new FormData();
    productData.append("product_image", formData.product_image);
    productData.append("product_name", formData.product_name);
    productData.append("product_price", formData.product_price);
    productData.append("product_quantity", formData.product_quantity);
    productData.append("product_author", formData.product_author);
    productData.append("product_description", formData.product_description);
    productData.append("product_category", formData.product_category);
    productData.append("product_publisher", formData.product_publisher);
    productData.append("product_dimensions", formData.product_dimensions);
    productData.append("product_weight", formData.product_weight);
    productData.append("product_pages", formData.product_pages);

    try {
      const response = await fetch(
        `https://rem-reacts.onrender.com/api/products/${id}`,
        {
          method: "PUT",
          body: productData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Something went wrong");
      }

      alert("Product updated successfully!");
      navigate(`/shop/${localStorage.getItem("sellerStoreId")}`); // Navigate to the seller's store page
    } catch (error) {
      console.error("Error updating product:", error);
      alert(`Error updating product: ${error.message}`);
    }
  };

  return (
    <div className="overlay">
      <div className="form-container shadow-lg p-5 rounded">
        <h2 className="text-center mb-4">Edit Product</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="product_image">Product Image</label>
            <input
              type="file"
              id="product_image"
              name="product_image"
              className="form-control"
              onChange={handleImageChange}
              accept="image/*"
            />
          </div>

          <div className="form-group">
            <label htmlFor="product_name">Product Name</label>
            <input
              type="text"
              id="product_name"
              name="product_name"
              className="form-control"
              value={formData.product_name}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="product_price">Product Price</label>
            <input
              type="number"
              id="product_price"
              name="product_price"
              className="form-control"
              value={formData.product_price}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="product_quantity">Product Quantity</label>
            <input
              type="number"
              id="product_quantity"
              name="product_quantity"
              className="form-control"
              value={formData.product_quantity}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="product_category">Product Category</label>
            <input
              type="text"
              id="product_category"
              name="product_category"
              className="form-control"
              value={formData.product_category}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="product_author">Product Author</label>
            <input
              type="text"
              id="product_author"
              name="product_author"
              className="form-control"
              value={formData.product_author}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="product_publisher">Product Publisher</label>
            <input
              type="text"
              id="product_publisher"
              name="product_publisher"
              className="form-control"
              value={formData.product_publisher}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="product_dimensions">Product Dimensions</label>
            <input
              type="text"
              id="product_dimensions"
              name="product_dimensions"
              className="form-control"
              value={formData.product_dimensions}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="product_weight">Product Weight</label>
            <input
              type="number"
              id="product_weight"
              name="product_weight"
              className="form-control"
              value={formData.product_weight}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="product_pages">Product Pages</label>
            <input
              type="number"
              id="product_pages"
              name="product_pages"
              className="form-control"
              value={formData.product_pages}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="product_description">Product Description</label>
            <textarea
              id="product_description"
              name="product_description"
              className="form-control"
              value={formData.product_description}
              onChange={handleChange}
              rows="4"
            />
          </div>

          <button type="submit" className="btns btn-primary btn-block">
            Update Product
          </button>

          <button
            type="button"
            onClick={() => setShowEditProductForm(false)}
            className="btn btn-secondary btn-block mt-2"
          >
            Close
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditProductForm;
