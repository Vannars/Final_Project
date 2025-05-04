import React from "react";
const logoPng = process.env.PUBLIC_URL + "/android-chrome-192x192.png";

const MapsList = ({
  userId,
  username,
  mindmaps,
  onMindmapClick
}) => {
  return (
    <div className="aurora-bg">
      <div className="backdrop">
        <div className="main-logo">
          <a href="/">
            <p>Map-Recallis</p>
            <img src={logoPng} alt="Map-Recallis Logo"/>
            <p>Conjugate Learning</p>
          </a>
        </div>
        <div className="main-menu">
          <div className="main-menu-header">
            <h1>{username ? `${username}'s Mindmaps` : "Mindmaps"}</h1>
          </div>
          <ul className="map-list">
            <h1 className="map-list-header">Dislaimer - Feature is is only partially implemented - maps are saved but cannot be accessed</h1>
            {mindmaps && mindmaps.length > 0 ? (
              mindmaps.map((m) => (
                <li key={m.MindMapID} className="map-list-item">
                  <button
                    className="theme-btn"
                    onClick={() => onMindmapClick(m.MindMapID)}
                  >
                    {m.MindMapName}
                  </button>
                </li>
              ))
            ) : (
              <li className="map-list-empty">No mindmaps found.</li>
            )}
          </ul>
        </div>
        <footer className="footer">Footer</footer>
      </div>
    </div>
  );
};

export default MapsList;