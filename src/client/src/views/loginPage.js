import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LogoutButton from "../components/logout.js";
import WaveSVG from "../components/waves.js"; // for wave SVG

const logoPng = process.env.PUBLIC_URL + "/android-chrome-192x192.png";

// LoginPage component
const LoginPage = ({ siteData, setUser, user }) => {
  // State for login form
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Handles login form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3001/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();

      if (response.ok) {
        setMessage("Login successful!");
        if (setUser) setUser({ username });
        setTimeout(() => navigate("/gettingstarted"), 500);
      } else {
        setMessage(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("An error occurred. Please try again.");
    }
  };

  // RENDER LOGIN PAGE with WelcomePage structure, NO links to other pages
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
          <h1 className="main-menu-header">Login for {siteData.siteName}</h1>
          <form onSubmit={handleSubmit} className="login-form">
            <p>
              Username:{" "}
              <input
                id="username"
                type="text"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </p>
            <p>
              Password:{" "}
              <input
                id="password"
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </p>
            <input type="submit" value="Login" />
          </form>
          {message && <p>{message}</p>}
          {user && (
            <p>
              Logged in as: {user.username} | <LogoutButton setUser={setUser} />
            </p>
          )}
        </div>
        <footer className="footer">
          <p>Created by: Noah Tambala (ntamb002)</p>
          <p>Contact: ntamb002@gold.ac.uk</p>
        </footer>
      </div>
      <WaveSVG />
    </div>
  );
};

export default LoginPage;