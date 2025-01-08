import React, { useEffect, useState } from "react";
import Nav from "./nav";
import "../css/profile.css";
import Loading from "./loading";
import noimage from "../assets/catno.png";
// Add FaEdit for the edit icon
import { Link } from "react-router-dom";
import OrderList from "./order_list";
const App = () => {
  const [username, setUsername] = useState(null);
  const [loading, setLoading] = useState(true);

  const [profileData, setProfileData] = useState({
    username: "",
    phoneNumber: "",
    email: "",
  });
  const [addresses, setAddresses] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [addressData, setAddressData] = useState({
    fullName: "",
    phoneNumber: "",
    region: "Luzon", // Default region
    province: "",
    city: "",
    barangay: "",
    postalCode: "",
    label: "Home",
  });

  // Complete data for the 3 main island groups (regions) and their provinces
  const regions = {
    Luzon: {
      provinces: [
        "Metro Manila",
        "Bulacan",
        "Cavite",
        "Laguna",
        "Batangas",
        "Pampanga",
        "Quezon",
        "Bataan",
        "Tarlac",
        "Zambales",
        "Pangasinan",
        "Nueva Ecija",
        "Aurora",
        "Benguet",
        "Ifugao",
        "Kalinga",
        "Mountain Province",
        "Isabela",
        "Cagayan",
        "Tuguegarao",
        "Albay",
        "Camarines Sur",
        "Camarines Norte",
        "Sorsogon",
        "Catanduanes",
        "Masbate",
        // You can add more provinces here
      ],
    },
    Visayas: {
      provinces: [
        "Negros Occidental",
        "Cebu",
        "Iloilo",
        "Leyte",
        "Bohol",
        "Samar",
        "Negros Oriental",
        "Aklan",
        "Antique",
        "Capiz",
        "Guimaras",
        "Biliran",
        // You can add more provinces here
      ],
    },
    Mindanao: {
      provinces: [
        "Davao del Sur",
        "Davao del Norte",
        "Davao Oriental",
        "Davao de Oro",
        "Bukidnon",
        "Agusan del Norte",
        "Agusan del Sur",
        "Surigao del Norte",
        "Surigao del Sur",
        "Zamboanga del Norte",
        "Zamboanga del Sur",
        "Zamboanga Sibugay",
        "Sultan Kudarat",
        "Cotabato",
        "South Cotabato",
        "Lanao del Norte",
        "Lanao del Sur",
        "Misamis Oriental",
        "Misamis Occidental",
        "Samar",
        "Tawi-Tawi",
        // You can add more provinces here
      ],
    },
  };
  const handleRegionChange = (e) => {
    const selectedRegion = e.target.value;
    setAddressData({
      ...addressData,
      region: selectedRegion,
      province: "", // Reset province when region changes
    });
  };

  const handleProvinceChange = (e) => {
    setAddressData({
      ...addressData,
      province: e.target.value,
    });
  };
  const [activeContent, setActiveContent] = useState("address"); // Added state for activeContent

  const showContent = (contentId) => {
    setActiveContent(contentId);
  };

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }

    const userId = localStorage.getItem("userId");
    if (userId) {
      fetchUserProfile(userId); // Fetch user profile data
      fetchAddresses(userId);
    } else {
      setLoading(false);
    }
  }, []);

  // Fetch user profile
  const fetchUserProfile = async (userId) => {
    try {
      const response = await fetch(
        `https://rem-reacts.onrender.com/api/profile/${userId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch profile");
      }
      const data = await response.json();
      setProfileData({
        phoneNumber: data.phoneNumber || "",
        email: data.email || "",
      });
    } catch (error) {
      console.error("Error fetching user profile:", error);
      alert("An error occurred while fetching the profile.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch addresses
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

  // Fetch notifications

  // Handle profile
  // Handle address change
  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddressData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Toggle address label between "Home" and "Work"
  const toggleAddressLabel = () => {
    setAddressData((prevData) => ({
      ...prevData,
      label: prevData.label === "Home" ? "Work" : "Home",
    }));
  };

  const addAddress = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("User not logged in. Cannot add address.");
      return;
    }

    // Include userId in the addressData being sent in the request body
    const addressDataWithUserId = {
      ...addressData,
      userId: userId, // Add userId to the request body
    };

    console.log("addressData", addressDataWithUserId); // Log the data before sending the request

    try {
      const response = await fetch(
        `https://rem-reacts.onrender.com/api/addresses`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(addressDataWithUserId),
        }
      );

      if (response.ok) {
        alert("Address added successfully!");
        fetchAddresses(userId); // Re-fetch addresses to update the list
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
      <Nav username={username} />
      <header className="App-header"></header>
      <div className="img-container">
        <div className="other-container">
          <p>{username}</p>
          <p>My Account</p>

          <a
            href="#"
            onClick={() => showContent("address")}
            className={activeContent === "address" ? "active" : ""}
          >
            Address
          </a>
          <a
            href="#"
            onClick={() => setActiveContent("orders")}
            className={activeContent === "orders" ? "active" : ""}
          >
            Order List
          </a>
        </div>
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
                    required
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
                    required
                  />
                </div>
                <div>
                  <label htmlFor="region">Region: </label>
                  <select
                    id="region"
                    name="region"
                    value={addressData.region}
                    onChange={handleRegionChange}
                    required
                  >
                    <option value="Luzon">Luzon</option>
                    <option value="Visayas">Visayas</option>
                    <option value="Mindanao">Mindanao</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="province">Province: </label>
                  <select
                    id="province"
                    name="province"
                    value={addressData.province}
                    onChange={handleProvinceChange}
                    required
                  >
                    {regions[addressData.region]?.provinces.map(
                      (province, index) => (
                        <option key={index} value={province}>
                          {province}
                        </option>
                      )
                    )}
                  </select>
                </div>

                <div>
                  <label htmlFor="city">City: </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={addressData.city}
                    onChange={handleAddressChange}
                    required
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
                    required
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
                    required
                  />
                </div>
                <button type="button" onClick={toggleAddressLabel}>
                  {addressData.label === "Home" ? "Set as Work" : "Set as Home"}
                </button>
                <button onClick={addAddress}>Add Address</button>
              </div>
            </div>
            <div className="saved-addresses-box">
              <h3>Saved Addresses</h3>
              <div className="saved-addresses">
                {addresses.map((address, index) => (
                  <div key={index} className="saved-address">
                    {address.user_id}, {address.phone_number},{address.region},{" "}
                    {address.province}, {address.city},{address.barangay},{" "}
                    {address.postal_code}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        {activeContent === "orders" && <OrderList />} {/* Render OrderList */}
      </div>
    </div>
  );
};

export default App;
