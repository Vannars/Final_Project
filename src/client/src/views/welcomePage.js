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
          </div>
          <nav className="nav">
            {user ? (
              <p>
                Logged in as: {user.username} | <LogoutButton setUser={setUser} />
              </p>
            ) : (
              <>
                <p>
                  <Link to="/login" className="theme-btn">Login</Link>
                </p>
                <p>
                  <Link to="/register" className="theme-btn">Register</Link>
                </p>
              </>
            )}
            <p>
              <Link to="/gettingStarted" className="theme-btn">Guest User</Link>
            </p>
            <p>
              <Link to="/users" className="theme-btn">User List</Link>
            </p>
          </nav>
        </div>
        <footer className="footer">Footer </footer>
      </div>
      <WaveSVG />
    </div>
  );
};
export default WelcomePage;