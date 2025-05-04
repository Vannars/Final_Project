// app.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// General imports
import WelcomePage from './views/welcomePage.js';
import GettingStarted from './views/gettingStartedPage.js';
import DemoPage from './views/demoPage.js';
import AboutPage from './views/aboutPage.js';
// Login/Register imports
import LoginPage from './views/loginPage.js';
import RegisterPage from './views/registerPage.js';
// Session related imports
import UserListPage from './views/userListPage.js';
import useSessionUser from './hooks/useSessionUser.js';
import useMaps from './hooks/useMaps.js';
import MapsList from './components/mapsList.js';

// Map generation/display
import GenerateMapPage from './views/generateMapPage.js';
import './styles/App.css';

const siteData = { siteName: "Map-Recallis" };

const App = () => {
  const [user, setUser] = useSessionUser();
  const { mindmaps } = useMaps(user?.UserID);

  // Load mindmap for mindmaps page - extension of useMaps
  const handleLoadMindmap = (mindmapId) => {
    fetch(`/api/mindmaps/${mindmapId}`)
      .then(res => res.json())
      .then(mindmap => {
        console.log(mindmap);
      });
  };

  return (
    <Router>
      <header className="App-header">
      <a href="/"><img
          src={process.env.PUBLIC_URL + "/android-chrome-192x192.png"}
          alt="Map-Recallis Logo"
          className="App-header"
        />
        <h1>Map-Recallis</h1></a>
      </header>
      <div>
        <Routes>
          <Route path="/" element={<WelcomePage siteData={siteData} user={user} setUser={setUser} />} />
          <Route path="/welcome-page" element={<WelcomePage siteData={siteData} user={user} setUser={setUser} />} />
          <Route path="/login" element={<LoginPage siteData={siteData} setUser={setUser} user={user} />} />
          <Route path="/register" element={<RegisterPage siteData={siteData} user={user} setUser={setUser} />} />
          <Route
            path="/mindmaps"
            element={
              <MapsList
                userId={user?.UserID}
                username={user?.username}
                mindmaps={mindmaps}
                onMindmapClick={handleLoadMindmap}
              />
            }
          />
          <Route path="/about" element={<AboutPage siteData={siteData} user={user} setUser={setUser} />} />
          <Route path="/demo" element={<DemoPage/>} />
          <Route path="/gettingstarted" element={<GettingStarted siteData={siteData} user={user} setUser={setUser} />} />
          <Route path="/generate-map" element={<GenerateMapPage siteData={siteData} user={user} setUser={setUser} />} />
          <Route path="/users" element={<UserListPage siteData={siteData} user={user} setUser={setUser} />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;