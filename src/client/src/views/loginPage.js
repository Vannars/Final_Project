import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LogoutButton from "../components/logout.js";

//Testing Plan - loginPage.js 
// This page renders the login page for MapRecallis. It includes a form for the user to enter their username and password credentials.

const LoginPage = ({ siteData, setUser, user }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

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

  return (
    <div>
      <header>
        <div className="logo">
          <a href="/">{siteData.siteName}</a>
        </div>
        <nav>
          <p>
            <a href="/">Home</a>
          </p>
          <p>
            <a href="/register">Register</a>
          </p>
          {user ? (
            <p>
              Logged in as: {user.username} | <LogoutButton setUser={setUser} />
            </p>
          ) : null}
        </nav>
      </header>

      <main>
        <h1>Login for {siteData.siteName}</h1>
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
      </main>

      <footer>
        <p>MapRecallis</p>
        <p>Created by: Noah Tambala (ntamb002)</p>
        <p>Contact: ntamb002@gold.ac.uk</p>
      </footer>
    </div>
  );
};

export default LoginPage;