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
  const [loading, setLoading] = useState(false); // State to track loading status
  const [regions] = useState(["Metro Manila", "Visayas", "Luzon", "Mindanao"]);
  const [errors, setErrors] = useState({}); // State for validation errors

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
        Swal.fire("Invalid File", "Please upload an image file.", "error");
        return;
      }

      if (!isValidSize) {
        Swal.fire("File Too Large", "File size exceeds 5MB.", "error");
        return;
      }

      setImage(file);
    }
  };

  const validate = async () => {
    const newErrors = {};

    if (!formData.storeName.trim()) {
      newErrors.storeName = "Store name is required.";
    } else {
      // Check if store name already exists
      try {
        const response = await fetch(
          `https://rem-reacts.onrender.com/api/sellers/checkStoreName?storeName=${formData.storeName}`
        );

        if (response.ok) {
          const data = await response.json();
          if (!data.isUnique) {
            newErrors.storeName = "Store name is already taken.";
          }
        } else {
          Swal.fire("Error", "Failed to check store name uniqueness.", "error");
        }
      } catch (error) {
        console.error("Error checking store name uniqueness:", error);
        Swal.fire("Error", "Failed to check store name uniqueness.", "error");
      }
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required.";
    } else if (!/^\d{10,12}$/.test(formData.phone)) {
      newErrors.phone = "Phone number must be 10-12 digits.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (
      !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(formData.email)
    ) {
      newErrors.email = "Email is not valid.";
    }

    if (!formData.region) {
      newErrors.region = "Region is required.";
    }

    if (!formData.province.trim()) {
      newErrors.province = "Province is required.";
    }

    if (!formData.city.trim()) {
      newErrors.city = "City is required.";
    }

    if (!formData.barangay.trim()) {
      newErrors.barangay = "Barangay is required.";
    }

    if (!formData.postalCode.trim()) {
      newErrors.postalCode = "Postal code is required.";
    } else if (!/^\d{4,5}$/.test(formData.postalCode)) {
      newErrors.postalCode = "Postal code must be 4-5 digits.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true); // Set loading state to true
    const isValid = await validate();

    if (!isValid) {
      setLoading(false);
      Swal.fire(
        "Validation Error",
        "Please fix the errors in the form.",
        "error"
      );
      return;
    }

    const userId = localStorage.getItem("userId");

    const formDataToSend = new FormData();
    formDataToSend.append("user_id", userId);
    formDataToSend.append("store_image", image);
    formDataToSend.append("store_name", formData.storeName);
    formDataToSend.append("phone", formData.phone);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("region", formData.region);
    formDataToSend.append("province", formData.province);
    formDataToSend.append("city", formData.city);
    formDataToSend.append("barangay", formData.barangay);
    formDataToSend.append("postal_code", formData.postalCode);

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

        Swal.fire({
          title: "Success!",
          text: "You have successfully registered as a seller.",
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          navigate(`/sellerprofile/${sellerStoreId}`);
        });
      } else {
        const errorData = await response.json();
        Swal.fire(
          "Error",
          errorData.message || "Something went wrong.",
          "error"
        );
      }
    } catch (error) {
      Swal.fire("Error", "An unexpected error occurred.", "error");
    } finally {
      setLoading(false); // Turn off loading state once the request completes
    }
  };

  return (
    <div className="seller-container-wrapper">
      {/* Floating loading message */}
      {loading && (
        <div className="floating-loading-message">
          Please wait... submitting your form.
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="seller-container">
          <p>
            Become a seller and start selling your products on Resource
            Exchange.
          </p>
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
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
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
            <p className="error">{errors.storeName}</p>
          </div>

          <div>
            <label>Phone:</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
            <p className="error">{errors.phone}</p>
          </div>

          <div>
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <p className="error">{errors.email}</p>
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
            <p className="error">{errors.region}</p>
          </div>

          <div>
            <label>Province:</label>
            <input
              type="text"
              name="province"
              value={formData.province}
              onChange={handleChange}
              required
            />
            <p className="error">{errors.province}</p>
          </div>

          <div>
            <label>City:</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
            />
            <p className="error">{errors.city}</p>
          </div>

          <div>
            <label>Barangay:</label>
            <input
              type="text"
              name="barangay"
              value={formData.barangay}
              onChange={handleChange}
              required
            />
            <p className="error">{errors.barangay}</p>
          </div>

          <div>
            <label>Postal Code:</label>
            <input
              type="text"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleChange}
              required
            />
            <p className="error">{errors.postalCode}</p>
          </div>

          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
};

export default StoreForm;
