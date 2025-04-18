import React from "react";

const LoginPage = ({ siteData }) => {
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
          <p>
            <a href="/users/register">Register</a>
          </p>
        </nav>
      </header>

      <main>
        <h1>Login for {siteData.siteName}</h1>
        <form method="POST" action="/users/loggedin" className="login-form">
          <p>
            Username: <input id="username" type="text" name="username" required />
          </p>
          <p>
            Password: <input id="password" type="password" name="password" required />
          </p>
          <input type="submit" value="Login" />
        </form>
      </main>

      <footer>
        <p>MapRecallis</p>
        <p>Created by: Noah Tambala (ntamb002)</p>
        <p>Contact: ntamb002@gold.ac.uk</p>
      </footer>
    </div>
  );
};

export default LoginPage;