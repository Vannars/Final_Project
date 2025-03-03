import React from 'react';
import MindMap from './components/mindmap'; //



// Extended dummy data 
const data = {
  "Question": "Root Question",
  "QAID": "root-id",
  "children": [
    {
      "Question": "Child Question 1",
      "Answer": "Child Answer 1",
      "QAID": "child-id-1",
      "children": [
        {
          "Question": "Grandchild Question 1.1",
        
          "QAID": "grandchild-id-1-1",
          "children": [
            {
              "Question": "Great-Grandchild Question 1.1.1",
              "QAID": "great-grandchild-id-1-1-1",
              "children": []
            },
            {
              "Question": "Great-Grandchild Question 1.1.2",
              "QAID": "great-grandchild-id-1-1-2",
              "children": []
            }
          ]
        },
        {
          "Question": "Grandchild Question 1.2",
          "QAID": "grandchild-id-1-2",
          "children": []
        }
      ]
    },
    {
      "Question": "Child Question 2",
      "QAID": "child-id-2",
      "children": [
        {
          "Question": "Grandchild Question 2.1",
          "QAID": "grandchild-id-2-1",
          "children": [
            {
              "Question": "Great-Grandchild Question 2.1.1",
              "QAID": "great-grandchild-id-2-1-1",
              "children": []
            }
          ]
        }
      ]
    },
    {
      "Question": "Child Question 3",
      "QAID": "child-id-3",
      "children": [
        {
          "Question": "Grandchild Question 3.1",
          "QAID": "grandchild-id-3-1",
          "children": []
        },
        {
          "Question": "Grandchild Question 3.2",
          "QAID": "grandchild-id-3-2",
          "children": [
            {
              "Question": "Great-Grandchild Question 3.2.1",
              "QAID": "great-grandchild-id-3-2-1",
              "children": []
            }
          ]
        }
      ]
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
