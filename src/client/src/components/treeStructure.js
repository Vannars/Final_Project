// This file contains the principal logic for rendering:
// 1. The tree structure of the mindmap using D3.js
// 2. Functionality for collapsing, updating and expanding nodes.
// 3. Dynamically scaling the SVG elements based on node positions
// 4. Interactivity for displaying the side panel to form a question-answer pair between the map and the panel (flashcarding).
// The functions collapseNodes and updateExpandCollapse are exported for usage in runMap.js and mainMap.js.
// ----------------------------------------------------------------------------------------------------------------------------------------

import * as d3 from "d3"; // Importing D3

// COLLAPSING THE TREE INITIALLY
export const collapseNodes = (node) => {
  // This function, when called, will recursively collapse all subsequent children nodes of the node passed to it
  if (node.children) {
    console.log("Collapsing node with QAID:", node.data.QAID);
    node._children = node.children; // Store hidden children
    node.children = null; // Collapse node
    node._children.forEach(collapseNodes); // Recursively collapse all children
  }
};

// updateExpandCollapse: Updates the tree structure, links, nodes, and SVG elements as the user interacts with the map
export const updateExpandCollapse = (
  root,     // references the root of the tree
  tree,     // references the tree layout function (d3.tree())
  svg,      // references the SVG (canvas)
  g,        // references the <g> element that holds the tree nodes and links
  source,   // references the node most recently interacted with
  toggleNode
) => {
  // Set custom spacing between nodes
  tree.nodeSize([60, 300])(root); // My custom node size
  const nodes = root.descendants(); // root.descendants() returns all children in d3.hierarchy format

  // SVG sizing, translating, and centering
  // Note: D3 often uses x (vertical) and y (horizontal) swapped compared to typical screen coordinates.
  const xExtent = d3.extent(nodes, (d) => d.x);
  const yExtent = d3.extent(nodes, (d) => d.y);
  const svgWidth = yExtent[1] - yExtent[0] + window.innerWidth;
  const svgHeight = xExtent[1] - xExtent[0] + window.innerHeight;

  svg.attr("width", svgWidth).attr("height", svgHeight);

  const translateX = (svgWidth - (yExtent[1] - yExtent[0])) / 2 - yExtent[0];
  const translateY = (svgHeight - (xExtent[1] - xExtent[0])) / 2 - xExtent[0];

  g.transition().duration(300).attr("transform", `translate(${translateX}, ${translateY})`);

  // NODE DEFINITION
  const node = g.selectAll(".node").data(nodes, (d) => d.data.QAID);

  // NODE UPDATE - .enter() to the tree, append("g") to group, give it class attributes, and translate the position
  const nodeUpdate = node
    .enter()
    .append("g")
    .attr("class", "node")
    .attr("transform", (d) => `translate(${source.y0 || d.y},${source.x0 || d.x})`);

  // NODE - label box
  nodeUpdate
    .append("foreignObject") //foreignObject container for HTML elements in the SVG
    .attr("class", "label-fo")
    .attr("x", 0)
    .attr("y", -20)
    .attr("width", 1000)
    .attr("height", 40)
    // they also have a div inside: label-box
    .append("xhtml:div")
    .attr("class", "label-box")
    // styling for label box
    .style("border", "1px solid black")
    .style("background", "#f0f0f0")
    .style("padding", "10px")
    .style("font-size", "14px")
    .style("white-space", "nowrap")
    .style("overflow", "visible")
    .style("display", "inline-block")
    .style("box-sizing", "border-box")
    .style("cursor", "pointer")
    // contain the question text
    .html((d) => d.data.Question)
    // an event listener just for debugging
    .on("click", (event, d) => {
      console.log("Open side panel for Answer:", d.data.Answer);
    });

  // NODE - label box - the real event listener for opening the side panel
  nodeUpdate.on("click", (event, d) => {
    event.stopPropagation(); // stop the event from bubbling to the parent node

    const sidePanel = document.getElementById("side-panel"); // retrieve side panel div (in App.js)
    const sidePanelContent = document.getElementById("side-panel-content"); // retrieve the content div (in App.js)
    if(sidePanel){
    // Populate the div content with the node's answer
    sidePanelContent.innerHTML = `
      <h4>${d.data.Answer}</h4>`;
    } else {
      console.error("Side panel not found in the DOM.");
    }
    

    // Display the side panel
    sidePanel.style.display = "block";
  });

  // NODE ANIMATION BETWEEN TRANSITIONS
  requestAnimationFrame(() => {
    g.selectAll(".node").each(function (d) {
      // select the label box on the node
      const foreignObject = this.querySelector(".label-box");
      if (!foreignObject) return; // if a node has no label, skip it

      const labelWidth = foreignObject.getBoundingClientRect().width; // get foreignObject width
      d.visualOffsetY = labelWidth + 10 + 15; // offset for link positioning etc.

      d3.select(this)
        .select("foreignObject.label-fo")
        .attr("width", labelWidth);

      const group = d3.select(this);
      group.selectAll(".toggle-fo").remove();

      // This condition is so a toggle button if the node has children (expanded) or _children (collapsed)
      if (d.children || d._children) {
        group
          .append("foreignObject")
          .attr("class", "toggle-fo")
          .attr("x", labelWidth + 10)
          .attr("y", -15)
          .attr("width", 30)
          .attr("height", 30)
          .append("xhtml:button")
          .attr("class", "toggle-button")
          .style("width", "30px")
          .style("height", "30px")
          .style("background", "#ccc")
          .style("border", "1px solid #000")
          .style("cursor", "pointer")
          .text((d) => (d.children || d._children ? "-" : "+"))
          .on("click", (event, d) => {
            event.stopPropagation();
            toggleNode(d);
          });
      }
    });

    // LINKS
    const allLinks = root.links();
    const link = g.selectAll(".link").data(allLinks, (d) => d.target.data.QAID);
    link
      .enter()
      .append("path")
      .attr("class", "link")
      .merge(link)
      .transition()
      .duration(300)
      .attr("d", (d) => {
        const sourceX = d.source.x;
        const targetX = d.target.x;

        const sourceLabelOffset = d.source.visualOffsetY || 100;
        const sourceY = d.source.y + sourceLabelOffset + 15;
        const targetY = d.target.y - 10;

        return `M${sourceY},${sourceX}
                L${sourceY + 50},${sourceX}
                L${targetY - 50},${targetX}
                L${targetY},${targetX}`;
      })
      .attr("fill", "none")
      .attr("stroke", "black")
      .attr("stroke-width", 1.5);

    link.exit().remove();
  });

  // NODE TRANSITION
  node
    .merge(nodeUpdate)
    .transition()
    .duration(300) // same as link transition duration - for visual consistency
    .attr("transform", (d) => `translate(${d.y},${d.x})`);

  node.exit().remove();

  // Saving  current positions of nodes - the next pass uses these as source positions
  nodes.forEach((d) => {
    d.x0 = d.x;
    d.y0 = d.y;
  });
};