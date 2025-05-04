import React from "react";
import { Link } from "react-router-dom";
import LogoutButton from "../components/logout.js";
import WaveSVG from "../components/waves.js"; // for wave SVG
const logoPng = process.env.PUBLIC_URL + "/android-chrome-192x192.png";

const WelcomePage = ({ user, setUser }) => {
  return (
    <div className="aurora-bg">
      <div className="backdrop">
        <div className="main-logo">
          <a href="/"><p>Map-Recallis</p><img src={logoPng} alt="Map-Recallis Logo"/><p>Conjugate Learning</p></a>
        </div>
        <div className="main-menu">
          <div className="main-menu-header">
            <h1>Welcome to Map-Recallis</h1>
            <b>Enjoy the lights or click the links below to start learning!</b>
          </div>
          <nav className="nav">
            {user ? (
              <>
                <p>
                  Logged in as: {user.username} | <LogoutButton setUser={setUser} />
                </p>
                <p>
                  <Link to="/about" className="theme-btn">About</Link>
                </p>
                <p>
                  <Link to="/gettingStarted" className="theme-btn">Getting Started</Link>
                </p>
              </>
            ) : (
              <>
               <p>
                  <Link to="/about" className="theme-btn">About</Link>
               </p>
                <p>
                  <Link to="/login" className="theme-btn">Login</Link>
                </p>
                <p>
                  <Link to="/register" className="theme-btn">Register</Link>
                </p>
                <p>
                  <Link to="/gettingStarted" className="theme-btn">Get Started</Link>
                </p>
              </>
            )}   
            <p>
              <Link to="/demo" className="theme-btn">Demo (Prompt Presets)</Link>
            </p>
            <p>
              <Link to="/mindmaps" className="theme-btn">My Maps (logged in only)</Link>
            </p>
        </nav>
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
export default WelcomePage;