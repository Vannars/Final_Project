// generatemapPage.js

//*-------- Note to self, in this page I  handle the fetch of data and display the generated map
// HOWEVER usemindmap_DisplayExecuteMain.js is where the html framework is created and the logic for saving and downloading the map exists
// bit of a brain ache to remember but there we go

import React, { useState, useEffect } from "react";
import DisplayMindmap from "../components/useMindmap_DisplayExecuteMain";
import { useLocation } from "react-router-dom"; // i used thiis to get the context from the previous page (gettingStartedPage.js)
import useSessionUser from "../hooks/useSessionUser";


const GenerateMapPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user] = useSessionUser();

  // Defined the context outside useEffect so it's available in the dependency array
  const defaultContext =
    "The answer to life the universe and everything is 42. This quote comes from the Hitchhikers guide to the galaxy by Douglas Adams.";
  const location = useLocation();
  const context = location.state?.context || defaultContext; // if default is showing then context wasnt retrived from the previous page (gettingStartedPage.js)
  const title = location.state?.title || "Mindmap"; // if default is showing then context wasnt retrived from the previous page (gettingStartedPage.js)

  useEffect(() => {
    console.log("Sending context:", context, typeof context);
    // Fetch the mindmap data from the backend
    fetch("http://localhost:3001/api/mindmap", {
      method: "POST",
      headers: {
        "Content-Type": "text/plain",
      },
      body: context,
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Http error status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        // Update the root node's title
        if (data && data.Question) {
          data.Question = title;
        }
        setData(data);
        setLoading(false); // sadly spinner not working :( 
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false); 
      });
  }, [context, title]);

  return <div><DisplayMindmap data={data} loading={loading} user={user}/></div>;
};

export default GenerateMapPage;
