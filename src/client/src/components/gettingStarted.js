import React from 'react';
import { Link } from 'react-router-dom';


const GettingStarted = () => {
    return (
        <div>
            <h1> Welcome to Map Recallis</h1>
            <p>This work in progress application allows you to generate flashcarding mindmaps from text input</p>
            <Link to="/generate-map"><button>Generate MindMap</button></Link>
        </div>
    )
};
export default GettingStarted;