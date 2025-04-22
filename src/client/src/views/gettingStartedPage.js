import React from 'react';
import { Link } from 'react-router-dom';
import LogoutButton from "../components/logout.js";
// This page renders getting started page. It includes the logo, welcome message, session info and currently only the output button (update tomorrow with entry form - file upload or text input).
const GettingStarted = ({ user, setUser }) => {
    return (
        <div>
            <header className="header">
                <div className="logo">
                    <a href="/">MapRecallis</a>
                </div>
                <nav className="nav">
                    <p><Link to="/">Home</Link></p>
                    {user ? (
                        <p>
                            Logged in as: {user.username} | <LogoutButton setUser={setUser} />
                        </p>
                    ) : (
                        <p>
                            <Link to="/login">Login</Link> | <Link to="/register">Register</Link>
                        </p>
                    )}
                </nav>
            </header>
            <h1> Welcome to Map Recallis</h1>
            <p>This work in progress application allows you to generate flashcarding mindmaps from text input</p>
            <Link to="/generate-map"><button>Generate MindMap</button></Link>
        </div>
    );
};

export default GettingStarted;