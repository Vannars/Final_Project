import React from "react";

const LogoutButton = ({ setUser }) => {
  const handleLogout = async () => {
    await fetch("http://localhost:3001/api/users/logout", {
      method: "POST",
      credentials: "include",
    });
    if (setUser) setUser(null);
  };

  return (
    <button onClick={handleLogout}>
      Logout
    </button>
  );
};

export default LogoutButton;