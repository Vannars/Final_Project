// import React, { useState, useEffect } from 'react';
// import MindMap from './mainMap';

// const GenerateMap = () => {
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const context = "The answer to life the universe and everything is 42. This quote comes from the Hitchhikers guide to the galaxy by Douglas Adams.";
  
//     // Fetch the mindmap data from the backend
//     fetch("http://localhost:3001/api/mindmap", {  // Updated port from 3002 to 3001
//       method: "POST",
//       headers: {
//         "Content-Type": "text/plain", // Indicate that the body is plain text
//       },
//       body: context, // Send plain text directly
//     })
//       .then((res) => {
//         if (!res.ok) {
//           throw new Error(`HTTP error! status: ${res.status}`);
//         }
//         return res.json(); // Parse JSON response from backend
//       })
//       .then((data) => {
//         setData(data); // Update state with the received mindmap data
//         setLoading(false);
//       })
//       .catch((error) => {
//         console.error("Error fetching data:", error);
//         setLoading(false); // Update loading state on error
//       });
//   }, []); // Empty dependency array, so this effect runs once on mount

//   return (
//     <div>
//       <h1>MindMap Application</h1>
//       {loading ? (
//         <p>Generating your mind map...</p>  // Loading message while waiting for the data
//       ) : data ? (
//         <MindMap data={data} />  // Pass the received data to MindMap component for rendering
//       ) : (
//         <p>Failed to load mind map.</p>  // Error message if data fetch fails
//       )}
//        {/* Side Panel */}
//     <div
//       id="side-panel"
//       style={{
//         position: "fixed",
//         right: 0,
//         top: 0,
//         width: "300px",
//         height: "100%",
//         background: "#f9f9f9",
//         borderLeft: "1px solid #ccc",
//         display: "none",
//         padding: "20px",
//       }}
//     >
//       <button
//         id="close-panel"
//         style={{
//           position: "absolute",
//           top: "10px",
//           right: "10px",
//         }}
//         onClick={() => {
//           document.getElementById("side-panel").style.display = "none";
//         }}
//       >
//         Close
//       </button>
//       <h3>Answer:</h3>
//       <div id="side-panel-content"></div>
//     </div>
//   </div>
//   );
// };
// export default GenerateMap;