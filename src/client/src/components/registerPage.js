import React from "react";

const RegisterPage = ({ siteData }) => {
  return (
    <div>
      <header>
        <p>
          <a href="../">Home</a>
        </p>
        <p>
          <a href="login">Login</a>
        </p>
      </header>

      <main>
        <h1>Register for {siteData.siteName}</h1>
        <form method="POST" action="registered">
          <p>
            First name: <input id="first" type="text" name="first" />
          </p>
          <p>
            Last name: <input id="last" type="text" name="last" />
          </p>
          <p>
            Email: <input id="email" type="text" name="email" />
          </p>
          <p>
            Username: <input id="username" type="text" name="username" />
          </p>
          <p>
            Password: <input id="password" type="password" name="password" />
          </p>
          <input type="submit" value="Register" />
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

export default RegisterPage;