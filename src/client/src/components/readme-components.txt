General site stuff:
waves.js           - Has a React component to render animated aurora/wave SVG backgrounds..
logout.js          - Renders the logout buton and handles logouts.

Mindmap Logic:
generateMindmap.js - Displays the mind map visualisation and side panel, given input data
runMap.js          - Custom React hook sets up the D3 mind map rendering and interactivity (importing from the other mindmap files).
mainMap.js         - Renders the MindMap SVG - applies D3 logic using my custom hook runMap.
mindmap.js         - D3-based MindMap component - it visualises hierarchical in a tree structure.
projectsList.js    - Displays a list of user projects.
treeStructure.js   - Contains D3 helper functions for collapsing, expanding, and updating the mind map tree structure. 