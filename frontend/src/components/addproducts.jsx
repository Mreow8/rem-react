import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/addproducts.css"; // Import custom CSS

function AddProductForm({ setShowAddProductForm }) {
  const [formData, setFormData] = useState({
    product_image: null,
    product_name: "",
    product_price: "",
    stock: "",
    product_author: "",
    product_description: "",
    category: "",
    product_publisher: "",
    product_dimensions: "",
    product_weight: "",
    product_pages: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    setFormData({ ...formData, product_image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const storeId = localStorage.getItem("sellerStoreId");

    if (!storeId) {
      alert("Store ID not found!");
      return;
    }

    if (
      !formData.product_image ||
      !formData.product_name ||
      !formData.product_price ||
      !formData.stock
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    const productData = new FormData();
    productData.append("product_image", formData.product_image);
    productData.append("product_name", formData.product_name);
    productData.append("product_price", formData.product_price);
    productData.append("stock", formData.stock);
    productData.append("product_author", formData.product_author);
    productData.append("product_description", formData.product_description);
    productData.append("category", formData.category);
    productData.append("product_publisher", formData.product_publisher);
    productData.append("product_dimensions", formData.product_dimensions);
    productData.append("product_weight", formData.product_weight);
    productData.append("product_pages", formData.product_pages);
    productData.append("store_id", storeId);

    try {
      const response = await fetch(
        "https://rem-reacts.onrender.com/api/products", // Your API endpoint
        {
          method: "POST",
          body: productData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Something went wrong");
      }

      const data = await response.json();
      alert("Product added successfully!");

      // Reset form
      setFormData({
        product_image: null,
        product_name: "",
        product_price: "",
        stock: "",
        product_author: "",
        product_description: "",
        category: "",
        product_publisher: "",
        product_dimensions: "",
        product_weight: "",
        product_pages: "",
      });
      document.getElementById("product_image").value = ""; // Reset file input
    } catch (error) {
      console.error("Error adding product:", error);
      alert(`Error adding product: ${error.message}`);
    }
  };

  return (
    <div className="overlay">
      <div className="form-container shadow-lg p-5 rounded">
        <h2 className="text-center mb-4">Add New Product</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="product_image">Book Image</label>
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
            <label htmlFor="product_name">Book Name</label>
            <input
              type="text"
              id="product_name"
              name="product_name"
              className="form-control"
              placeholder="Book Name"
              value={formData.product_name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="product_price">Book Price</label>
            <input
              type="number"
              id="product_price"
              name="product_price"
              className="form-control"
              placeholder="Book Price"
              value={formData.product_price}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="stock">Stock</label>
            <input
              type="number"
              id="stock"
              name="stock"
              className="form-control"
              placeholder="Stocks"
              value={formData.stock}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Book Category</label>
            <input
              type="text"
              id="category"
              name="category"
              className="form-control"
              placeholder="Book Category"
              value={formData.category}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="product_author">Book Author</label>
            <input
              type="text"
              id="product_author"
              name="product_author"
              className="form-control"
              placeholder="Book Author"
              value={formData.product_author}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="product_publisher">Book Publisher</label>
            <input
              type="text"
              id="product_publisher"
              name="product_publisher"
              className="form-control"
              placeholder="Book Publisher"
              value={formData.product_publisher}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="product_dimensions">Book Dimensions</label>
            <input
              type="text"
              id="product_dimensions"
              name="product_dimensions"
              className="form-control"
              placeholder="Book Dimensions"
              value={formData.product_dimensions}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="product_weight">Book Weight</label>
            <input
              type="number"
              id="product_weight"
              name="product_weight"
              className="form-control"
              placeholder="Book Weight"
              value={formData.product_weight}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="product_pages">Book Pages</label>
            <input
              type="number"
              id="product_pages"
              name="product_pages"
              className="form-control"
              placeholder="Book Pages"
              value={formData.product_pages}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="product_description">Book Description</label>
            <textarea
              id="product_description"
              name="product_description"
              className="form-control"
              placeholder="Book Description"
              value={formData.product_description}
              onChange={handleChange}
              rows="4" // Adjust the number of rows as needed
              required
            />
          </div>

          <button type="submit" className="btns btn-primary btn-block">
            Add Book
          </button>

          <button
            type="button"
            onClick={() => setShowAddProductForm(false)}
            className="btn btn-secondary btn-block mt-2"
          >
            Close
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddProductForm;
