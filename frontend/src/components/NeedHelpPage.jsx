import React from "react";
import fb from "../assets/facebook-logo.png";
import email from "../assets/email-logo.png";

const NeedHelpPage = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Need Help?</h1>
      <p style={styles.description}>
        We are here to assist you! You can reach us through the following
        channels:
      </p>

      <div style={styles.contactInfo}>
        <h3 style={styles.contactTitle}>Email:</h3>
        <p style={styles.contactDetails}>
          <a href="mailto:resourceExchange@gmail.com" style={styles.link}>
            <img src={email} alt="Email" style={styles.logo} />
            support@example.com
          </a>
        </p>

        <h3 style={styles.contactTitle}>Facebook:</h3>
        <p style={styles.contactDetails}>
          <a
            href="https://www.facebook.com/yourpage"
            target="_blank"
            rel="noopener noreferrer"
            style={styles.link}
          >
            <img src={fb} alt="Facebook" style={styles.logo} />
            Visit our Facebook page
          </a>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    maxWidth: "600px",
    margin: "0 auto",
    textAlign: "center",
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  title: {
    fontSize: "2em",
    marginBottom: "10px",
    color: "#333",
  },
  description: {
    fontSize: "1.2em",
    marginBottom: "20px",
    color: "#555",
  },
  contactInfo: {
    textAlign: "left",
  },
  contactTitle: {
    fontSize: "1.5em",
    marginBottom: "5px",
    color: "#333",
  },
  contactDetails: {
    fontSize: "1.2em",
    marginBottom: "15px",
    color: "#555",
  },
  link: {
    color: "#0073e6",
    textDecoration: "none",
    display: "flex",
    alignItems: "center",
  },
  logo: {
    width: "24px", // Adjust logo size
    height: "24px",
    marginRight: "10px",
  },
};

export default NeedHelpPage;
