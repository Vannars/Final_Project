import React, { useState, useEffect } from "react";
import LogoutButton from "../components/logout";
// Testing plan - This page helps me test user registration and login functionality

const UserListPage = ({ siteData, user, setUser }) => {
  console.log("UserListPage user prop:", user);
  // State to store the list of users
  const [availableUsers, setAvailableUsers] = useState([]);

  // Fetching a list of users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/users"); //Fetch users api 
        const data = await response.json(); 
        setAvailableUsers(data); // Update with the list of users
      } catch (error) {
        console.error("Error fetching users:", error); 
      }
    };

    fetchUsers(); // Call the fetch function
  }, []); // empty dependency = run when mounted

  //RENDER USER LIST PAGE
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
          {user ? (
            <p>
              Logged in as: {user.username} | <LogoutButton setUser={setUser} />
            </p>
          ) : (
            <p>
              <a href="/login">Login</a> | <a href="/register">Register</a>
            </p>
          )}
        </nav>
      </header>
      <main>
        <h1>{siteData.siteName} site</h1>
        <h2>Here are the list of users</h2>
        <ul className="user-list">
          {availableUsers.map((user, index) => (
            <li key={user.username || index} className="user-item">
              {user.username}
            </li>
          ))}
        </ul>
      </main>
      <footer className="footer">
        <p>Map-Recallis</p>
        <p>Created by: Noah Tambala (ntamb002)</p>
        <p>Contact: ntamb002@gold.ac.uk</p>
      </footer>
    </div>
  );
};

export default UserListPage;