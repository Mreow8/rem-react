import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/addproducts.css"; // Import custom CSS

function App() {
  const [formData, setFormData] = useState({
    product_image: null,
    product_name: "",
    product_price: "",
    product_quantity: "",
    product_author: "",
    product_description: "",
    product_category: "",
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
    productData.append("store_id", storeId);

    try {
      const response = await fetch(
        "https://rem-reacts.onrender.com/api/products",
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
        product_quantity: "",
        product_author: "",
        product_description: "",
        product_category: "",
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
              placeholder="Product Name"
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
              placeholder="Product Price"
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
              placeholder="Product Quantity"
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
              placeholder="Product Category"
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
              placeholder="Product Author"
              value={formData.product_author}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="product_description">Product Description</label>
            <textarea
              id="product_description"
              name="product_description"
              className="form-control"
              placeholder="Product Description"
              value={formData.product_description}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="btn btn-primary btn-block">
            Add Product
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
