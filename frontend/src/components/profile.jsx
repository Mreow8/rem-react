import React, { useEffect, useState } from "react";
import Nav from "./nav";
import "../css/profile.css";
import Loading from "./loading";
import noimage from "../assets/catno.png";

const App = () => {
  const [username, setUsername] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeContent, setActiveContent] = useState("profile");
  const [profileData, setProfileData] = useState({
    phoneNumber: "",
    email: "",
  });
  const [errors, setErrors] = useState({
    phoneNumber: "",
    email: "",
  });

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    const userId = localStorage.getItem("userId");

    if (storedUsername) setUsername(storedUsername);
    if (userId) fetchProfileData(userId);

    setLoading(false);
  }, []);

  const fetchProfileData = async (userId) => {
    try {
      const response = await fetch(
        `https://rem-reacts.onrender.com/api/profile/${userId}`
      );
      const data = await response.json();
      setProfileData({
        phoneNumber: data.phoneNumber || "",
        email: data.email || "",
      });
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };

  const validateInput = (name, value) => {
    if (name === "phoneNumber") {
      const isValidPhone = /^[0-9]+$/.test(value);
      return isValidPhone ? "" : "Phone number must contain only numbers.";
    }
    if (name === "email") {
      const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      return isValidEmail ? "" : "Invalid email format.";
    }
    return "";
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    const error = validateInput(name, value);

    setProfileData((prevData) => ({ ...prevData, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
  };

  const updateProfile = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("User not logged in. Cannot update profile.");
      return;
    }

    if (errors.phoneNumber || errors.email) {
      alert("Please fix validation errors before updating.");
      return;
    }

    try {
      const response = await fetch(
        `https://rem-reacts.onrender.com/api/profile/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(profileData),
        }
      );

      if (response.ok) {
        alert("Profile updated successfully!");
      } else {
        const errorData = await response.json();
        alert(`Failed to update profile: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("An error occurred while updating the profile. Please try again.");
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="App">
      <Nav username={username} />
      <div className="profile-container">
        {activeContent === "profile" && (
          <div className="img-prof-container">
            <div className="content">
              <h2>Profile Information</h2>
              <div>
                <label htmlFor="phoneNumber">
                  Phone Number:{" "}
                  <span role="img" aria-label="Edit">
                    ✏️
                  </span>
                </label>
                <input
                  type="text"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={profileData.phoneNumber}
                  onChange={handleProfileChange}
                />
                {errors.phoneNumber && (
                  <small className="error">{errors.phoneNumber}</small>
                )}
              </div>
              <div>
                <label htmlFor="email">
                  Email:{" "}
                  <span role="img" aria-label="Edit">
                    ✏️
                  </span>
                </label>
                <input
                  type="text"
                  id="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleProfileChange}
                />
                {errors.email && (
                  <small className="error">{errors.email}</small>
                )}
              </div>
              <button type="button" onClick={updateProfile}>
                Save
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
