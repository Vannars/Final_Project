import React from "react";
import { Link } from "react-router-dom";

const WelcomePage = () => {
  return (
    <div>
      <div className="backdrop">
        <div className="logo">
          <a href="/">MapRecallis</a>
        </div>
        <div className="main-menu">
          <div className="main-menu-header">
            <h1>Welcome to MapRecallis</h1>
          </div>
          <nav className="nav">
            <p>
              <Link to="/login">Login</Link>
            </p>
            <p>
              <Link to="/register">Register</Link>
            </p>
            <p>
              <Link to="/gettingStarted">Guest User</Link>
            </p>
          </nav>
        </div>
        <footer className="footer">Footer </footer>
      </div>
    </div>
  );
};
export default WelcomePage;
