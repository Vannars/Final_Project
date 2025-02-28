import React from 'react';
import MindMap from './components/mindmap'; //



// dummy data 
const data = {
  "Question": "Root Question",
  "QAID": "root-id",
  "children": [
    {
      "Question": "Child Question 1",
      "QAID": "child-id-1",
      "children": []
    },
    {
      "Question": "Child Question 2",
      "QAID": "child-id-2",
      "children": []
    }
  ]
};

const App = () => {
  return (
    <div>
      <h1>MindMap Application</h1>
      <MindMap data={data} />
    </div>
  );
};

export default App;
