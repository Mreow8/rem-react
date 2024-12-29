import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap for styling

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
    e.preventDefault(); // Prevent default form submission behavior
    const storeId = localStorage.getItem("sellerStoreId"); // Updated key
    console.log("Store ID:", storeId); // Log the storeId for debugging

    if (!storeId) {
      alert("Store ID not found!");
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
    productData.append("store_id", storeId); // Append the store ID to the form data

    // Log FormData entries for debugging
    for (let [key, value] of productData.entries()) {
      console.log(`${key}: ${value}`);
    }

    try {
      const response = await fetch(
        "https://rem-reacts.onrender.com/api/seller-products",
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
      console.log("Response from server:", data);
      alert("Product added successfully!");
      setFormData({
        product_image: null,
        product_name: "",
        product_price: "",
        product_quantity: "",
        product_author: "",
        product_description: "",
        product_category: "",
      });
    } catch (error) {
      console.error("Error adding product:", error); // Enhanced logging
      alert(`Error adding product: ${error.message}`);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Add New Product</h2>
      <form onSubmit={handleSubmit} className="shadow p-4 rounded">
        <div className="form-group">
          <label>Product Image</label>
          <input
            type="file"
            name="product_image"
            className="form-control"
            onChange={handleImageChange}
            accept="image/*" // Accept image files
          />
        </div>

        <div className="form-group">
          <label>Product Name</label>
          <input
            type="text"
            name="product_name"
            className="form-control"
            placeholder="Product Name"
            value={formData.product_name}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Product Price</label>
          <input
            type="number"
            name="product_price"
            className="form-control"
            placeholder="Product Price"
            value={formData.product_price}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Product Quantity</label>
          <input
            type="number"
            name="product_quantity"
            className="form-control"
            placeholder="Product Quantity"
            value={formData.product_quantity}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Product Category</label>
          <input
            type="text"
            name="product_category"
            className="form-control"
            placeholder="Product Category"
            value={formData.product_category}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Product Author</label>
          <input
            type="text"
            name="product_author"
            className="form-control"
            placeholder="Product Author"
            value={formData.product_author}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Product Description</label>
          <textarea
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
  );
}

export default App;
