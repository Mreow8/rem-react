import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Nav from "./nav";
import "../css/profile.css";
import Loading from "./loading";
import noimage from "../assets/catno.png";
import { FaEdit } from "react-icons/fa";

const App = () => {
  const [username, setUsername] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState({
    phoneNumber: "",
    email: "",
  });
  const [isEditing, setIsEditing] = useState({
    phoneNumber: false,
    email: false,
  });
  const [addresses, setAddresses] = useState([]);
  const [addressData, setAddressData] = useState({
    fullName: "",
    phoneNumber: "",
    region: "Luzon",
    province: "",
    city: "",
    barangay: "",
    postalCode: "",
    label: "Home",
  });
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState(null);
  const [activeContent, setActiveContent] = useState("profile");

  const regions = {
    Luzon: { provinces: ["Metro Manila", "Bulacan", "Cavite", "Laguna"] },
    Visayas: { provinces: ["Cebu", "Iloilo", "Leyte"] },
    Mindanao: {
      provinces: ["Davao del Sur", "Bukidnon", "Zamboanga del Norte"],
    },
  };

  const navigate = useNavigate();

  // Fetch Orders
  const fetchOrders = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        navigate("/login");
        return;
      }

      const response = await fetch(
        `https://rem-reacts.onrender.com/api/orders/${userId}`
      );
      const data = await response.json();

      if (data.orders) {
        setOrders(data.orders);
      } else {
        setOrdersError("No orders found.");
      }
    } catch (err) {
      setOrdersError("Error fetching orders.");
    } finally {
      setOrdersLoading(false);
    }
  };

  // Fetch User Profile and Addresses
  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }

    const userId = localStorage.getItem("userId");
    if (userId) {
      fetchUserProfile(userId);
      fetchAddresses(userId);
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserProfile = async (userId) => {
    try {
      const response = await fetch(
        `https://rem-reacts.onrender.com/api/profile/${userId}`
      );
      if (!response.ok) throw new Error("Failed to fetch profile");
      const data = await response.json();
      setProfileData({
        phoneNumber: data.phoneNumber || "",
        email: data.email || "",
      });
    } catch (error) {
      console.error("Error fetching user profile:", error);
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

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleEditClick = (field) => {
    setIsEditing((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  const updateProfile = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("User not logged in. Cannot update profile.");
      return;
    }
    const updatedProfile = {
      phoneNumber: profileData.phoneNumber,
      email: profileData.email,
    };
    try {
      const response = await fetch(
        `https://rem-reacts.onrender.com/api/profile/${userId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedProfile),
        }
      );
      if (response.ok) {
        alert("Profile updated successfully!");
      } else {
        alert("Failed to update profile.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleRegionChange = (e) => {
    const selectedRegion = e.target.value;
    setAddressData((prevData) => ({
      ...prevData,
      region: selectedRegion,
      province: "",
    }));
  };

  const handleProvinceChange = (e) => {
    setAddressData((prevData) => ({
      ...prevData,
      province: e.target.value,
    }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddressData((prevData) => ({ ...prevData, [name]: value }));
  };

  const addAddress = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("User not logged in. Cannot add address.");
      return;
    }
    try {
      const response = await fetch(
        `https://rem-reacts.onrender.com/api/addresses`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...addressData, userId }),
        }
      );
      if (response.ok) {
        alert("Address added successfully!");
        fetchAddresses(userId);
      } else {
        alert("Failed to add address.");
      }
    } catch (error) {
      console.error("Error adding address:", error);
    }
  };

  const handlePayNow = (orderId) => {
    navigate(`/pay/${orderId}`);
  };

  if (loading) return <Loading />;

  return (
    <div className="App">
      <Nav username={username} />
      <div className="img-container">
        <div className="other-container">
          <p>{username}</p>
          <p>My Account</p>
          <a
            href="#"
            onClick={() => setActiveContent("profile")}
            className={activeContent === "profile" ? "active" : ""}
          >
            Profile
          </a>
          <a
            href="#"
            onClick={() => setActiveContent("address")}
            className={activeContent === "address" ? "active" : ""}
          >
            Address
          </a>
          <a
            href="#"
            onClick={() => setActiveContent("orders")}
            className={activeContent === "orders" ? "active" : ""}
          >
            Orders
          </a>
        </div>

        <div className="profile-container">
          {activeContent === "profile" && (
            <div className="img-prof-container">
              <p>Profile Information</p>
              <div>
                <label>Username:</label>
                <input type="text" value={username} readOnly />
              </div>
              <div>
                <label>Phone Number:</label>
                <input
                  type="text"
                  value={profileData.phoneNumber}
                  readOnly={!isEditing.phoneNumber}
                  onChange={handleProfileChange}
                />
                <FaEdit onClick={() => handleEditClick("phoneNumber")} />
              </div>
              <div>
                <label>Email:</label>
                <input
                  type="email"
                  value={profileData.email}
                  readOnly={!isEditing.email}
                  onChange={handleProfileChange}
                />
                <FaEdit onClick={() => handleEditClick("email")} />
              </div>
              <button onClick={updateProfile}>Save Changes</button>
            </div>
          )}

          {activeContent === "address" && (
            <div className="address-container">
              <div className="address-form">
                <h3>Add Address</h3>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={addressData.fullName}
                  onChange={handleAddressChange}
                  name="fullName"
                />
                <button onClick={addAddress}>Add Address</button>
              </div>
            </div>
          )}

          {activeContent === "orders" && (
            <div className="orders-container">
              <h3>Your Orders</h3>
              {ordersLoading ? (
                <p>Loading...</p>
              ) : ordersError ? (
                <p>{ordersError}</p>
              ) : (
                orders.map((order) => (
                  <div key={order.order_id}>
                    <h4>Order ID: {order.order_id}</h4>
                    <p>Total: Php {order.total_amount}</p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
