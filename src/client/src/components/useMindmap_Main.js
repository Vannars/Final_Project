// runMap.js
import { useEffect } from "react";
import * as d3 from "d3";
import { collapseNodes, updateExpandCollapse } from "./useMindmap_TreeStructure";
//===============================================================MINDMAP DEFINITION===============================================================
// MindMap component - takes 'data' as a prop; this has to be a hierarchical JSON structure.
// The component itself renders an SVG - a D3 tree

const useMindMap = (svgRef, data) => {
  console.log("Data for the map exists as: ", data); // Check if data is received

  //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<USE EFFECT HOOK OPEN >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  useEffect(() => {
    console.log("useEffect triggered");
    if (!data) return; // Prevents running if no data is provided

    //===============================================================TREE SETUP===============================================================
    // Here I convert JSON data into a D3 hierarchy (tsree).
    // The 'root' object refers to the top node of the tree - can be used throughout the component.
    // I am also specifying the node size for spacing between nodes

    const root = d3.hierarchy(data); // Convert JSON into D3 hierarchy ref link - https://observablehq.com/@d3/tidy-tree
    console.log("Root is: ", root);
    const tree = d3.tree().nodeSize([100, 200]); // tree is an inbuilt function in d3 - my node size is 100px by 200pxs
    tree(root); // this indicates a tree with nodes of size 100px by 200px, with root (the origin node) containing the D3 hierarchy data (aka json that has been converted to a tree in d3)
    console.log("Tree layout is: ", root.descendants()); // Check tree structure - does it have children ?

    root.children?.forEach(collapseNodes); // Collapse all children initially

    //===============================================================SVG SETUP===============================================================
    // Here I define the SVG canvas.
    // The SVG starts with a fixed value that can be dynamically scaled (see Dynamic Scaling section).
    // The 'g' group element holds the tree nodes and links.

    const svg = d3
      .select(svgRef.current)
      .attr("width", 1000) 
      .attr("height", 1000) 
      .attr("class", "mindmap-svg")
    svg.selectAll("*").remove(); // Clear previous renders
    const g = svg.append("g"); // Create group container for the tree

    //===============================================================TOGGLE NODE FUNCTION===============================================================
    // This function expands or collapses a node when it is clicked.
    // If a node has hidden children in '_children', they are restored.
    // Otherwise, the node's children are hidden.
    const toggleNode = (d) => {
      console.log("Toggling node with QAID:", d.data.QAID);
      if (d.children) { // If node has d.children (true)
        d._children = d.children; // d._children stores nodes d.children nodes
        d.children = null; // original node's child nodes (d.children) become null (effectively gets "hidden")
      } else if (d._children) { // If node has d._children (hidden children) (true)
        d.children = d._children; // node's own children (d.children) become the stored hidden children (d._children)
      }
      // Toggle renders using d as source 
      updateExpandCollapse(root, tree, svg, g, d, toggleNode);
    };

    //===============================================================TREE UPDATE INITIALIZATION===============================================================
    root.x0 = root.x; // this it stores the position of the root node about its xy coords
    root.y0 = root.y;
    
    // Ugh this was a mind ache - initial render uses root as source 
    updateExpandCollapse(root, tree, svg, g, root, toggleNode);

  }, [svgRef, data]);
};

export default useMindMap;
