import React, { useState } from "react";
import Swal from "sweetalert2"; // Import SweetAlert2
import "../css/sellers.css";
import { useNavigate } from "react-router-dom";

const StoreForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    storeName: "",
    region: "",
    phone: "",
    email: "",
    province: "",
    city: "",
    barangay: "",
    postalCode: "",
  });

  const [image, setImage] = useState(null);
  const regions = ["Metro Manila", "Visayas", "Luzon", "Mindanao"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const isValidType = file.type.startsWith("image/");
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB max

      if (!isValidType) {
        alert("Please upload an image file.");
        return;
      }

      if (!isValidSize) {
        alert("File size exceeds 5MB.");
        return;
      }

      setImage(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem("userId");

    const formDataToSend = new FormData();
    formDataToSend.append("store_image", image);
    formDataToSend.append("store_name", formData.storeName);
    formDataToSend.append("phone", formData.phone);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("region", formData.region);
    formDataToSend.append("province", formData.province);
    formDataToSend.append("city", formData.city);
    formDataToSend.append("barangay", formData.barangay);
    formDataToSend.append("postal_code", formData.postalCode);
    formDataToSend.append("user_id", userId);

    try {
      const response = await fetch(
        "https://rem-reacts.onrender.com/api/sellers",
        {
          method: "POST",
          body: formDataToSend,
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Seller added successfully:", data);

        const sellerStoreId = data.sellerId;
        localStorage.setItem("sellerStoreId", sellerStoreId);
        localStorage.setItem("storeName", formData.storeName);

        // SweetAlert Success Message
        Swal.fire({
          title: "Success!",
          text: "You have successfully registered as a seller.",
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          // Navigate after success
          navigate(`/store/${sellerStoreId}`);
        });
      } else {
        const errorData = await response.json();
        console.error("Error:", errorData.message);
        // Optionally, display an error message to the user here
        Swal.fire({
          title: "Error",
          text: errorData.message || "Something went wrong.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        title: "Error",
        text: "An unexpected error occurred.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <div className="seller-container-wrapper">
      <form onSubmit={handleSubmit}>
        <div className="seller-container">
          <div>
            <label>Upload Image:</label>
            <input type="file" accept="image/*" onChange={handleImageChange} />
          </div>

          {image && (
            <div>
              <h3>Selected Image:</h3>
              <div
                style={{
                  width: "150px",
                  height: "150px",
                  borderRadius: "50%",
                  overflow: "hidden",
                  border: "2px solid #ddd",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <img
                  src={URL.createObjectURL(image)}
                  alt="Selected"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </div>
            </div>
          )}

          {/* Form Fields */}
          <div>
            <label>Store Name:</label>
            <input
              type="text"
              name="storeName"
              value={formData.storeName}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label>Phone:</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div>
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div>
            <label>Region:</label>
            <select
              name="region"
              value={formData.region}
              onChange={handleChange}
              required
            >
              <option value="">Select a Region</option>
              {regions.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
          </div>

          {/* Other Fields for Address */}
          <div>
            <label>Province:</label>
            <input
              type="text"
              name="province"
              value={formData.province}
              onChange={handleChange}
            />
          </div>

          <div>
            <label>City:</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
            />
          </div>

          <div>
            <label>Barangay:</label>
            <input
              type="text"
              name="barangay"
              value={formData.barangay}
              onChange={handleChange}
            />
          </div>

          <div>
            <label>Postal Code:</label>
            <input
              type="number"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleChange}
            />
          </div>

          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
};

export default StoreForm;
