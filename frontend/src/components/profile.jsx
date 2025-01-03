import React, { useEffect, useState } from "react";
import Nav from "./nav";
import "../css/profile.css";
import Loading from "./loading";
import noimage from "../assets/catno.png";

const App = () => {
  const [username, setUsername] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeContent, setActiveContent] = useState("profile");
  const [profileData, setProfileData] = useState({
    phoneNumber: "",
    email: "",
  });
  const [addressData, setAddressData] = useState({
    fullName: "",
    phoneNumber: "",
    region: "",
    province: "",
    city: "",
    barangay: "",
    postalCode: "",
    label: "Home",
  });
  const [addresses, setAddresses] = useState([]);
  const [notifications, setNotifications] = useState([]); // Initialize as an empty array

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }

    const userId = localStorage.getItem("userId");
    if (userId) {
      fetchCartItems(userId);
      fetchAddresses(userId);
      fetchNotifications(userId); // Fetch notifications on load
    } else {
      setLoading(false);
    }
  }, []);

  const fetchCartItems = async (userId) => {
    try {
      const response = await fetch(
        `https://rem-reacts.onrender.com/api/cart/${userId}`
      );
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("Error fetching cart items:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAddresses = async (userId) => {
    try {
      const response = await fetch(
        `https://rem-reacts.onrender.com/api/addresses/${userId}`
      );
      const data = await response.json();
      setAddresses(data.addresses || []);
    } catch (error) {
      console.error("Error fetching addresses:", error);
    }
  };

  const fetchNotifications = async (userId) => {
    try {
      const response = await fetch(
        `https://rem-reacts.onrender.com/api/notifications/${userId}`
      );
      const data = await response.json();
      console.log("Fetched notifications:", data.notifications);
      setNotifications(data.notifications || []);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("userId");
    setUsername(null);
    alert("Logged out successfully!");
  };

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const showContent = (contentId) => {
    setActiveContent(contentId);
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddressData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const toggleAddressLabel = () => {
    setAddressData((prevData) => ({
      ...prevData,
      label: prevData.label === "Home" ? "Work" : "Home",
    }));
  };

  const updateProfile = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("User not logged in. Cannot update profile.");
      return;
    }

    const updatedProfile = {};

    // Include only fields that have values
    if (profileData.phoneNumber)
      updatedProfile.phoneNumber = profileData.phoneNumber;
    if (profileData.email) updatedProfile.email = profileData.email;

    try {
      const response = await fetch(
        `https://rem-reacts.onrender.com/api/profile/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedProfile),
        }
      );

      if (response.ok) {
        alert("Profile updated successfully!");
        setProfileData({
          phoneNumber: "",
          email: "",
        });
      } else {
        const errorData = await response.json();
        alert(`Failed to update profile: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("An error occurred while updating the profile. Please try again.");
    }
  };

  const addAddress = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("User not logged in. Cannot add address.");
      return;
    }

    const newAddress = {
      ...addressData,
      userId,
    };

    try {
      const response = await fetch(
        "https://rem-reacts.onrender.com/api/addresses",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newAddress),
        }
      );

      if (response.ok) {
        const result = await response.json();
        setAddresses((prevAddresses) => [
          ...prevAddresses,
          { ...newAddress, id: result.addressId },
        ]);
        alert("Address added successfully!");
        setAddressData({
          fullName: "",
          phoneNumber: "",
          region: "",
          province: "",
          city: "",
          barangay: "",
          postalCode: "",
          label: "Home",
        });
      } else {
        const errorData = await response.json();
        alert(`Failed to add address: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error adding address:", error);
      alert("An error occurred while adding the address. Please try again.");
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="App">
      <Nav username={username} handleLogout={handleLogout} />
      <header className="App-header"></header>
      <div className="img-container">
        <div className="other-container">
          <p>{username}</p>
          <p>My Account</p>
          <a
            href="#"
            onClick={() => showContent("profile")}
            className={activeContent === "profile" ? "active" : ""}
          >
            Profile
          </a>
          <a
            href="#"
            onClick={() => showContent("address")}
            className={activeContent === "address" ? "active" : ""}
          >
            Address
          </a>
          <a
            href="#"
            onClick={() => showContent("notifications")}
            className={activeContent === "notifications" ? "active" : ""}
          >
            Notification
          </a>
        </div>

        <div className="profile-container">
          {activeContent === "profile" && (
            <div className="img-prof-container">
              <div className="content">
                <p>Profile Information</p>
                <p>Manage and protect your account</p>
                <div>
                  <label htmlFor="username">Username: </label>
                  <input type="text" id="username" value={username} readOnly />
                </div>
                <div>
                  <label htmlFor="phoneNumber">Phone Number: </label>
                  <input
                    type="text"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={profileData.phoneNumber}
                    onChange={handleProfileChange}
                  />
                </div>
                <div>
                  <label htmlFor="email">Email: </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleProfileChange}
                  />
                </div>
              </div>

              <button type="button" onClick={updateProfile}>
                Save
              </button>
            </div>
          )}

          {activeContent === "address" && (
            <div className="address-container">
              <div className="address-box">
                <p>Address Information</p>
                <div className="address-form">
                  <div>
                    <label htmlFor="fullName">Full Name: </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={addressData.fullName}
                      onChange={handleAddressChange}
                    />
                  </div>
                  <div>
                    <label htmlFor="phoneNumber">Phone Number: </label>
                    <input
                      type="text"
                      id="phoneNumber"
                      name="phoneNumber"
                      value={addressData.phoneNumber}
                      onChange={handleAddressChange}
                    />
                  </div>
                  <div>
                    <label htmlFor="region">Region: </label>
                    <input
                      type="text"
                      id="region"
                      name="region"
                      value={addressData.region}
                      onChange={handleAddressChange}
                    />
                  </div>
                  <div>
                    <label htmlFor="province">Province: </label>
                    <input
                      type="text"
                      id="province"
                      name="province"
                      value={addressData.province}
                      onChange={handleAddressChange}
                    />
                  </div>
                  <div>
                    <label htmlFor="city">City: </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={addressData.city}
                      onChange={handleAddressChange}
                    />
                  </div>
                  <div>
                    <label htmlFor="barangay">Barangay: </label>
                    <input
                      type="text"
                      id="barangay"
                      name="barangay"
                      value={addressData.barangay}
                      onChange={handleAddressChange}
                    />
                  </div>
                  <div>
                    <label htmlFor="postalCode">Postal Code: </label>
                    <input
                      type="text"
                      id="postalCode"
                      name="postalCode"
                      value={addressData.postalCode}
                      onChange={handleAddressChange}
                    />
                  </div>
                  <button type="button" onClick={toggleAddressLabel}>
                    {addressData.label === "Home"
                      ? "Set as Work"
                      : "Set as Home"}
                  </button>
                  <button onClick={addAddress}>Add Address</button>
                </div>
              </div>
              <div className="saved-addresses-box">
                <h3>Saved Addresses</h3>
                <div className="saved-addresses">
                  {addresses.map((address, index) => (
                    <div key={index} className="saved-address">
                      {address.user_id}, {address.phone_number},{address.region}
                      , {address.province}, {address.city},{address.barangay},{" "}
                      {address.postal_code}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeContent === "notifications" && (
            <div className="notifications-container">
              <h3>Notifications</h3>
              {notifications.length > 0 ? (
                notifications.map((notification, index) => (
                  <div key={index} className="notification-item">
                    <p>{notification.message}</p>
                    <small>{notification.created_at}</small>
                  </div>
                ))
              ) : (
                <div className="no-notifications">
                  <img
                    src={noimage}
                    alt="No Notifications"
                    className="no-notifications-image"
                  />
                  <p>No new notifications.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
