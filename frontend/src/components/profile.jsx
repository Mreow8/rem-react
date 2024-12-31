import React, { useEffect, useState } from "react";
import Nav from "./nav";
import "../css/profile.css";

const App = () => {
  const [username, setUsername] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeContent, setActiveContent] = useState("profile"); // Set profile as active initially
  const [profileData, setProfileData] = useState({
    phoneNumber: "",
    email: "",
  });
  const [addressData, setAddressData] = useState({
    address: "",
    city: "",
    postalCode: "",
  });
  const [addresses, setAddresses] = useState([]); // State for multiple addresses
  const [profilePicture, setProfilePicture] = useState(null); // State for profile picture
  const [profilePicturePreview, setProfilePicturePreview] = useState(null); // For previewing the image

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }

    const userId = localStorage.getItem("userId");
    if (userId) {
      fetchCartItems(userId);
      fetchAddresses(userId);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchCartItems = async (userId) => {
    try {
      const response = await fetch(`/api/cart/${userId}`);
      const data = await response.json();
      console.log(data); // Use this data in the UI
    } catch (error) {
      console.error("Error fetching cart items:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAddresses = async (userId) => {
    try {
      const response = await fetch(`/api/addresses/${userId}`);
      const data = await response.json();
      setAddresses(data.addresses || []);
    } catch (error) {
      console.error("Error fetching addresses:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("userId");
    setUsername(null);
    alert("Logged out successfully!");
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const showContent = (contentId) => {
    setActiveContent(contentId); // Update activeContent state
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

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicturePreview(reader.result); // Set the image preview
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
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

              <div className="img-con">
                {profilePicturePreview && (
                  <div className="profile-picture-preview">
                    <img src={profilePicturePreview} alt="Profile" />
                  </div>
                )}
                <label htmlFor="profilePicture">Profile Picture: </label>
                <input
                  type="file"
                  id="profilePicture"
                  accept="image/*"
                  onChange={handleProfilePictureChange}
                />

                <button>Save</button>
              </div>
            </div>
          )}

          {activeContent === "address" && (
            <div className="address-container">
              <div className="address-box">
                <p>Address Information</p>
                <div className="address-form">
                  <div>
                    <label htmlFor="address">Address: </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={addressData.address}
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
                    <label htmlFor="postalCode">Postal Code: </label>
                    <input
                      type="text"
                      id="postalCode"
                      name="postalCode"
                      value={addressData.postalCode}
                      onChange={handleAddressChange}
                    />
                  </div>
                  <button>Add Address</button>
                </div>
              </div>

              <div className="saved-addresses-box">
                <h3>Saved Addresses</h3>
                <div className="saved-addresses">
                  {addresses.map((address, index) => (
                    <div key={index} className="saved-address">
                      {address.address}, {address.city}, {address.postalCode}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
