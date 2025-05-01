import React from "react";
import MindMap from "./useMindmap_ExectuteMain";

const DisplayMindmap = ({ data, loading }) => (
  <div>
    <h1>Map-Recallis</h1>
    <button
      onClick={() => {
        const mapData = window.__mindmap_root__ ? window.__mindmap_root__.data : data;
        const blob = new Blob([JSON.stringify(mapData, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "mindmap.json";
        a.click();
        URL.revokeObjectURL(url);
      }}
      style={{ marginBottom: "16px" }}
    >
      Download map - JSON
    </button>
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

export default DisplayMindmap;