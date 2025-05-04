// useMindmap_DisplayExecuteMain.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import MindMap from "./useMindmap_ExectuteMain";

const DisplayMindmap = ({ data, loading, user }) => {
  const [notification, setNotification] = useState("");
  const navigate = useNavigate();

  // Downloading the generated map as a JSON file
  const mapDownload = () => {
    const mapData = window.mindmapRoot ? window.mindmapRoot.data : data;
    const blob = new Blob([JSON.stringify(mapData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "mindmap.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  // Saving the generated map to the database and redirecting to the mindmaps page
  const mapSave = () => {
    const mapData = window.mindmapRoot ? window.mindmapRoot.data : data;
    const mindmapName = prompt("Enter a name for your mindmap:");  
    console.log("Mindmap name:", mindmapName);
    console.log("User object before save:", user);
    if (!mindmapName) return;
    fetch("http://localhost:3001/api/mindmaps", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        UserID: user.UserID,
        MindMapName: mindmapName,
        MapData: mapData
      })
    })
      .then(res => res.json())
      .then(result => {
        console.log("Save result:", result);
        if (result.MindMapID) {
          console.log("Attempting to navigate to mindmaps..");
          navigate("/mindmaps");
        } else {
          setNotification("Failed to save mindmap to the database.");
          setTimeout(() => setNotification(""), 2500);
        }
      });
  };

  // The div container for the web page/ map and side panel
  return (
    <div>
      <h1>Map-Recallis</h1>
      {user && (
      <div className="main-menu-header">
        Logged in as: {user.username}
      </div>
    )}
      {notification && (
        <div style={{
          background: "#4caf50",
          color: "#fff",
          padding: "10px 20px",
          borderRadius: "3px",
          marginBottom: "12px",
          textAlign: "center"
        }}>
          {notification}
        </div>
      )}
      <button
        onClick={mapDownload}
        className="theme-btn"
        style={{ marginBottom: "12px" }}
      >
        Download map - JSON
      </button>
      {user && (
        <button
          onClick={mapSave}
          className="theme-btn"
          style={{ marginLeft: "10px", marginBottom: "16px" }}
        >
          Save Mindmap
        </button>
      )}
      {loading ? (
        <p>Generating your mind map...</p>
      ) : data ? (
        <MindMap data={data} />
      ) : (
        <p>Failed to generate mind map.</p>
      )}
      <div
        id="side-panel"
        style={{
          position: "fixed",
          right: 0,
          top: 0,
          width: "300px",
          height: "100%",
          background: "rgba(34, 34, 64, 0.95)",
          borderLeft: "1px solid #ccc",
          display: "none",
          padding: "20px",
        }}
      >
        <button
          id="close-panel"
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
          }}
          onClick={() => {
            document.getElementById("side-panel").style.display = "none";
          }}
        >
          Close
        </button>
        <h3>Answer:</h3>
        <div id="side-panel-content"></div>
      </div>
    </div>
  );
};

export default DisplayMindmap;