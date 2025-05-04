//useSessionUser.js
import { useState, useEffect, useCallback} from "react";
// Tracking the session state (is a user logged in)
export default function useSessionUser() {
  const [user, setUser] = useState(null); // taking user, and setUser
  const sessionRefresh=useCallback(() => {
  fetch("http://localhost:3001/api/users/session", {
    credentials: "include", // include cookie (session id)
  })
    .then(res => res.json()) // respond with json (which should contain the session data)
    .then(data => {
      if (data.loggedIn) setUser({ username: data.username, UserID: data.userID}); // logged in becomes the username in the recived session data
      else setUser(null); // if not logged in user is null (not logged in)
    });
  }, []); // empty dependency array = run once when mounted

  useEffect(() => {
    sessionRefresh();
  }, [sessionRefresh]);

  return [user, setUser, sessionRefresh];
}