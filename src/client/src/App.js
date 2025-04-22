import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GenerateMap from './components/generateMap';
import WelcomePage from './views/welcomePage.js';
import LoginPage from './views/loginPage.js';
import GettingStarted from './views/gettingStartedPage.js';
import RegisterPage from './views/registerPage.js';
import UserListPage from './views/userListPage.js';
import useSessionUser from './hooks/useSessionUser.js';

const siteData = { siteName: "MapRecallis" };

const App = () => {
  const [user, setUser] = useSessionUser();
  return (
    <Router>
      <div>
        <h1>MapRecallis</h1>
        <Routes>
          <Route path="/" element={<WelcomePage siteData={siteData} user={user} setUser={setUser} />} />
          <Route path="/welcome-page" element={<WelcomePage siteData={siteData} user={user} setUser={setUser} />} />
          <Route path="/login" element={<LoginPage siteData={siteData} setUser={setUser} user={user} />} />
          <Route path="/register" element={<RegisterPage siteData={siteData} user={user} setUser={setUser} />} />
          <Route path="/gettingstarted" element={<GettingStarted siteData={siteData} user={user} setUser={setUser} />} />
          <Route path="/generate-map" element={<GenerateMap siteData={siteData} user={user} setUser={setUser} />} />
          <Route path="/users" element={<UserListPage siteData={siteData} user={user} setUser={setUser} />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;