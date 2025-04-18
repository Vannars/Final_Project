import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GenerateMap from './components/generateMap';
import WelcomePage from './components/welcomePage.js';
import LoginPage from './components/loginPage.js';
import GettingStarted from './components/gettingStarted.js';
import RegisterPage from './components/registerPage.js';

const siteData = { siteName: "MapRecallis" };
const App = () => {
  return (
    <Router>
      <div>
        <h1>MapRecallis</h1>
        <Routes>
          <Route path="/" element={<WelcomePage siteData={siteData} />} />
          <Route path = "/welcome-page" element={<WelcomePage siteData={siteData} />}/>
          <Route path = "/login" element = {< LoginPage siteData={siteData}/>} />
          <Route path = "/register" element = {< RegisterPage siteData={siteData}/>} />
          <Route path = "/gettingstarted" element = {< GettingStarted siteData={siteData}/>} />
          <Route path="/generate-map" element={<GenerateMap siteData={siteData} />} />       
        </Routes>
      </div>
    </Router>
  );
};

export default App;
