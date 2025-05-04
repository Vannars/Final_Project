import { useState, useEffect } from "react";

export default function useMaps(UserID) {
  const [mindmaps, setMindmaps] = useState([]);

  useEffect(() => {
    if (UserID) {
      fetch(`http://localhost:3001/api/mindmaps/user/${UserID}`)
        .then(res => res.json())
        .then(setMindmaps);
    }
  }, [UserID]);

  return { mindmaps };
}