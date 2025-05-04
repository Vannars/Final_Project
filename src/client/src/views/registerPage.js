import React, { useState } from "react";
import LogoutButton from "../components/logout";
import WaveSVG from "../components/waves"; // for wave SVG
const logoPng = process.env.PUBLIC_URL + "/android-chrome-192x192.png";

const RegisterPage = ({ siteData, user, setUser }) => {
  // State to store form data
  const [formData, setFormData] = useState({
    first: "",
    last: "",
    email: "",
    username: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  // Handles changes in input fields and updates the formData state
  const handleChange = (e) => {
    const { name, value } = e.target; // Extract name and value from the input field
    setFormData({ ...formData, [name]: value }); // Update the field in formData
  };

  // Handles form submission and sends registration data to the backend
  const handleSubmit = async (e) => {
    e.preventDefault(); // Overide default form submission behavior (page refesh)
    try {
      //POST request to backend users for register endpoint
      const response = await fetch("http://localhost:3001/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // 
        },
        body: JSON.stringify(formData), // Send form data as json
      });

      const data = await response.json(); // Parse the json response

      if (response.ok) {
        setMessage("Registration successful!"); 
      } else {
        setMessage(data.message || "Registration failed"); 
      }
    } catch (error) {
      console.error("Error:", error); 
      setMessage("An error while registering: Please try again or contact sitemaster."); 
    }
  };

  // RENDER REGISTER PAGE with WelcomePage structure, NO links to other pages
  return (
    <div className="aurora-bg">
      <div className="backdrop">
        <div className="main-logo">
          <a href="/">
            <p>Map-Recallis</p>
            <img src={logoPng} alt="Map-Recallis Logo" />
            <p>Conjugate Learning</p>
          </a>
        </div>
        <div className="main-menu">
          <h1 className="main-menu-header">Register for {siteData.siteName}</h1>
          <form onSubmit={handleSubmit} className="login-form">
            <p>
              First name:{" "}
              <input
                id="first"
                type="text"
                name="first"
                value={formData.first}
                onChange={handleChange}
                required
              />
            </p>
            <p>
              Last name:{" "}
              <input
                id="last"
                type="text"
                name="last"
                value={formData.last}
                onChange={handleChange}
                required
              />
            </p>
            <p>
              Email:{" "}
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </p>
            <p>
              Username:{" "}
              <input
                id="username"
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </p>
            <p>
              Password:{" "}
              <input
                id="password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </p>
            <button type="submit">Register</button>
          </form>
          {message && <p>{message}</p>}
          {user && (
            <p>
              Logged in as: {user.username} | <LogoutButton setUser={setUser} />
            </p>
          )}
        </div>
        <footer className="footer">
          <p>Map-Recallis</p>
          <p>Created by: Noah Tambala (ntamb002)</p>
          <p>Contact: ntamb002@gold.ac.uk</p>
        </footer>
      </div>
      <WaveSVG />
    </div>
  );
};

export default RegisterPage;