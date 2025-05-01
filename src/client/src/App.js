import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WelcomePage from './views/welcomePage.js';
import LoginPage from './views/loginPage.js';
import GettingStarted from './views/gettingStartedPage.js';
import RegisterPage from './views/registerPage.js';
import UserListPage from './views/userListPage.js';
import useSessionUser from './hooks/useSessionUser.js';
import GenerateMapPage from './views/generateMapPage.js';
import './styles/App.css';
const siteData = { siteName: "Map-Recallis" };

const App = () => {
  const [user, setUser] = useSessionUser();
  return (
    <Router>
      <header className="App-header">
        <img
          src={process.env.PUBLIC_URL + "/android-chrome-192x192.png"}
          alt="Map-Recallis Logo"
          className="App-header"
        />
        <h1>Map-Recallis</h1>
      </header>
      <div>
        <Routes>
          <Route path="/" element={<WelcomePage siteData={siteData} user={user} setUser={setUser} />} />
          <Route path="/welcome-page" element={<WelcomePage siteData={siteData} user={user} setUser={setUser} />} />
          <Route path="/login" element={<LoginPage siteData={siteData} setUser={setUser} user={user} />} />
          <Route path="/register" element={<RegisterPage siteData={siteData} user={user} setUser={setUser} />} />
          <Route path="/gettingstarted" element={<GettingStarted siteData={siteData} user={user} setUser={setUser} />} />
          <Route path="/generate-map" element={<GenerateMapPage siteData={siteData} user={user} setUser={setUser} />} />
          <Route path="/users" element={<UserListPage siteData={siteData} user={user} setUser={setUser} />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;