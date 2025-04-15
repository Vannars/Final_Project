import React, { useState, useEffect } from 'react';
import MindMap from './components/mainMap';

const App = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const context = "The answer to life the universe and everything is 42.";
  
    // Fetch the mindmap data from the backend
    fetch("http://localhost:3001/api/mindmap", {  // Updated port from 3002 to 3001
      method: "POST",
      headers: {
        "Content-Type": "text/plain", // Indicate that the body is plain text
      },
      body: context, // Send plain text directly
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json(); // Parse JSON response from backend
      })
      .then((data) => {
        setData(data); // Update state with the received mindmap data
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false); // Update loading state on error
      });
  }, []); // Empty dependency array, so this effect runs once on mount

  return (
    <div>
      <h1>MindMap Application</h1>
      {loading ? (
        <p>Generating your mind map...</p>  // Loading message while waiting for the data
      ) : data ? (
        <MindMap data={data} />  // Pass the received data to MindMap component for rendering
      ) : (
        <p>Failed to load mind map.</p>  // Error message if data fetch fails
      )}
    </div>
  );
};

export default App;




// Extended dummy data 
// const data = {
//   "Question": "Root Question",
//   "QAID": "root-id",
//   "children": [
//     {
//       "Question": "Child Question 1",
//       "Answer": "Child Answer 1",
//       "QAID": "child-id-1",
//       "children": [
//         {
//           "Question": "Grandchild Question 1.1",
        
//           "QAID": "grandchild-id-1-1",
//           "children": [
//             {
//               "Question": "Great-Grandchild Question 1.1.1",
//               "QAID": "great-grandchild-id-1-1-1",
//               "children": []
//             },
//             {
//               "Question": "Great-Grandchild Question 1.1.2",
//               "QAID": "great-grandchild-id-1-1-2",
//               "children": []
//             }
//           ]
//         },
//         {
//           "Question": "Grandchild Question 1.2",
//           "QAID": "grandchild-id-1-2",
//           "children": []
//         }
//       ]
//     },
//     {
//       "Question": "Child Question 2",
//       "QAID": "child-id-2",
//       "children": [
//         {
//           "Question": "Grandchild Question 2.1",
//           "QAID": "grandchild-id-2-1",
//           "children": [
//             {
//               "Question": "Great-Grandchild Question 2.1.1",
//               "QAID": "great-grandchild-id-2-1-1",
//               "children": []
//             }
//           ]
//         }
//       ]
//     },
//     {
//       "Question": "Child Question 3",
//       "QAID": "child-id-3",
//       "children": [
//         {
//           "Question": "Grandchild Question 3.1",
//           "QAID": "grandchild-id-3-1",
//           "children": []
//         },
//         {
//           "Question": "Grandchild Question 3.2",
//           "QAID": "grandchild-id-3-2",
//           "children": [
//             {
//               "Question": "Great-Grandchild Question 3.2.1",
//               "QAID": "great-grandchild-id-3-2-1",
//               "children": []
//             }
//           ]
//         }
//       ]
//     }
//   ]
// };

// const App = () => {
//   return (
//     <div>
//       <h1>MindMap Application</h1>
//       <MindMap data={data} />
//     </div>
//   );
// };

