//===============================================================IMPORTS===============================================================
// Importing react with useEffect and useRef hooks -
// D3 - is used in this module to handles data vis and the main tree structure

import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

//===============================================================MINDMAP DEFINITION===============================================================
// MindMap component - takes 'data' as a prop; this has to be a hierarchical JSON structure.
// The component itself renders an SVG - a D3 tree

const MindMap = ({ data }) => {
  console.log("Data for the map exists as: ", data); // Check if data is received
  const svgRef = useRef(); // Reference to the SVG element

  //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<USE EFFECT HOOK OPEN >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  useEffect(() => {
    console.log("useEffect triggered");
    if (!data) return; // Prevents running if no data is provided

    //===============================================================TREE SETUP===============================================================
    // Here I convert JSON data into a D3 hierarchy (tree).
    // The 'root' object refers to the top node of the tree - can be used throughout the component.
    // I am also specifying the node size for spacing between nodes

    const root = d3.hierarchy(data); // Convert JSON into D3 hierarchy ref link - https://observablehq.com/@d3/tidy-tree
    console.log("Root is: ", root);

    const tree = d3.tree().nodeSize([100, 200]); // tree is a inbuilt function in d3 - my node size is 100px by 200pxs
    tree(root); // this indicates a tree with nodes of size 100px by 200px, with root (the origin node) containing the d3 hierarchy data (aka json that has been converted to a tree in d3)
    console.log("Tree layout is: ", root.descendants()); // Check tree structure - does it have children ?

    //===============================================================COLLAPSING THE TREE INITIALLY===============================================================
    // Default state is all nodes collapsed - only the root and its children are visible.
    // The collapseNodes function stores children in '_children' to be used in - toggleNode - later

    const collapseNodes = (node) => {
      if (node.children) {
        console.log("Collapsing node with QAID:", node.data.QAID);
        node._children = node.children; // Store hidden children
        node.children = null; // Collapse node
        node._children.forEach(collapseNodes); // Recursively collapse all children
      }
    };

    root.children?.forEach(collapseNodes); // Collapse all children initially

    //===============================================================SVG SETUP===============================================================
    // Here I define the SVG canvas.
    // The SVG starts with a fixed vaalue that can bee dynamicaled scaled (see Dynamic Scaling section).
    // The 'g' group element holds the tree nodes and links.

    const svg = d3
      .select(svgRef.current)
      .attr("width", 1000) // Initial width
      .attr("height", 1000) // Initial height
      .style("border", "1px solid black");
    svg.selectAll("*").remove(); // Clear previous renders
    const g = svg.append("g"); // Create group container for the tree

    //===============================================================TREE UPDATE FUNCTION===============================================================
    // This function updates the tree whenever nodes are expanded or collapsed.
    // It recalculates positions, redraws links, and repositions nodes.
    // (See Toggle Node section for when this function is triggered.)
    // Here is how I update the tree when nodes expand/collapse
    // positions , links and nodes need to be recalulated and rendered when a user interacts with the tree

    const updateExpandCollapse = (source) => {
      // source = clicked node
      console.log("Updating tree layout... Source:", source);

      tree(root); // Recalculate node positions
      const nodes = root.descendants(); // Const to nodes (childred and descendants)
      const links = root.links(); // Const to get nodes (links)

      //===============================================================DYNAMIC SIZING===============================================================
      //  SVG is resizes based on the tree’s dimensions.
      // It calculates the min/max x and y values of all nodes and adjusts the SVG size relative to the window centering the tree
      // d - defined in d.y is the x coordinate of the node
      // d - defined in d.x is the y coordinate of the node
      // d3.extent - ref link - https://observablehq.com/@d3/d3-extent returns the minimum and maximum value in the given array using natural order
      // in the array [0] is the min value and [1] is the max value


      const xExtent = d3.extent(nodes, (d) => d.x); // gets the min and max x coordinates of the nodes d.x
      const yExtent = d3.extent(nodes, (d) => d.y); // gets the min and max y coordinates of the nodes d.y

      const svgWidth = yExtent[1] - yExtent[0] + window.innerWidth; // Dynamic width - window.innerWidth - the width of the browser window
      const svgHeight = xExtent[1] - xExtent[0] + window.innerHeight; // Dynamic height - window.innerHeight - the height of the browser window

      svg.attr("width", svgWidth).attr("height", svgHeight); // svg attribute: setting width/height are adjusted basd on the above ^
      console.log("Svg dimensions: ", svgWidth, svgHeight);

      //Algorithm to center the tree in the SVG:
      // 1. Calculate the difference between Svg width and the treeX (xExtent)
      // 2. Calculate the difference between Svg height and the treeY (yExtent)
      // 3. Calculate translateX by subtracting xExtent from the Svg width and dividing by 2.
      // 4. Calculate translateY by subtracting yExtent from Svg height and dividing by 2.
      // 5. Apply translateX/translateY to the group element - centers the tree in the Svg.
      
      // 
      const translateX =
        (svgWidth - (yExtent[1] - yExtent[0])) / 2 - yExtent[0]; 
      const translateY =
        (svgHeight - (xExtent[1] - xExtent[0])) / 2 - xExtent[0]; //adjust - i might need to adjust this to get the tree to center in the svg

      g.transition()
        .duration(2)
        .attr("transform", `translate(${translateX}, ${translateY})`); // This kinda works like animation 

      //===============================================================ROUTES (LINKS) BETWEEN NODES===============================================================
      // This section creates and updates the lines connecting the nodes.
      // The links are drawn dynamically and repositioned whenever the tree updates.

      const link = g.selectAll(".link").data(links, (d) => d.target.data.QAID); // Select all links and its data - specifically QAID (its unique identifier)

      link 
        .enter()
        .append("path")
        .attr("class", "link")
        .merge(link)
        .transition()
        .duration(50)
        .attr(
          "d",
          // Here, y is in the x position and x is in the y position - because the tree is rotated 90 degrees and d3 tree is vertical by default
          (d) => `
          M${d.source.y},${d.source.x}
          L${d.source.y + 50},${d.source.x}  
          L${d.source.y + 50},${d.target.x}  
          L${d.target.y},${d.target.x}
        `
        )
        .attr("fill", "none")
        .attr("stroke", "black");

      link.exit().remove(); // Remove outdated links

      //===============================================================NODES (CIRCLES - change to rect )===============================================================
      // Each node is represented as a circle.
      // If a node has children, its blue othewise its green.
      // Clicking on a node toggles its expansion/collapse (see Toggle Node section).

      const node = g.selectAll(".node").data(nodes, (d) => d.data.QAID); // const g from before  - selecting all the nodes and its data - QAID

      const nodeEnter = node
        .enter() // Enter method - ref link - https://observablehq.com/@d3/selection-enter - enter creates placeholder values for elements that are not in the dom - yet
        .append("g") 
        .attr("class", "node")
        .attr(
          "transform",
          (d) => `translate(${source.y0 || d.y},${source.x0 || d.x})`
        )
        .on("click", (event, d) => toggleNode(d));

      nodeEnter
        .append("circle")
        .attr("r", 10) // Node size
        .attr("fill", (d) => (d.children || d._children ? "blue" : "green")) // If d.children or d._children, blue, else green
        .attr("stroke", "black")
        .attr("stroke-width", 2);

      //===============================================================TEXT LABELS===============================================================
      // Each node is labeled with its question
      // Arbitrary text positioning.

      nodeEnter
        .append("text")
        .attr("x", 15)
        .attr("dy", ".35em")
        .text((d) => d.data.Question)
        .attr("font-size", "14px")
        .attr("fill", "black");

      node
        .merge(nodeEnter)  // merge method - ref link - https://observablehq.com/@d3/selection-merge
        .transition()
        .duration(50)
        .attr("transform", (d) => `translate(${d.y},${d.x})`);
      node.exit().remove(); // Remove obsolete nodes

      nodes.forEach((d) => {
        // for each node, make the current x and y the previous x and y
        d.x0 = d.x;
        d.y0 = d.y;
      });

      console.log("updateExpandCollapse complete");
    };

    //===============================================================TOGGLE NODE (EXPAND/COLLAPSE)===============================================================
    // This function expands or collapses a node when it is clicked.
    // If a node has hidden children in '_children', they are restored.
    // Otherwise, the node's children are hidden.

    const toggleNode = (d) => {
      console.log("Toggling node with QAID:", d.data.QAID); 
      //The following runs on a click - 
      if (d.children) { // If node has d.children (true)
        d._children = d.children; // d._children stores nodes d.children nodes
        d.children = null; // original node's child nodes  (d.children) become null (effectively gets "hidden")
      } else if (d._children) { // If node has d._children (hidden children) (true)
        d.children = d._children; // node's own children (d.children) become the stored hidden children (d._children)
      }
      updateExpandCollapse(d); // pulls it all together with render - transitions and positonal updates
    };
    root.x0 = root.x; // this it stores the postion of the root node about its xy coords
    root.y0 = root.y;
    updateExpandCollapse(root); //render 
  }, [data]);

  return <svg ref={svgRef}></svg>; // SVG container for rendering is returned at the end of calling mindmap
}; //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<USE EFFECT HOOK CLOSE >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

export default MindMap;
