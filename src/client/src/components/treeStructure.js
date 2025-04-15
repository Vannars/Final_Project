// treeStructure.js
import * as d3 from "d3";

//COLLAPSING THE TREE INITIALLY
// Default state is all nodes collapsed - only the root and its children are visible.
// The collapseNodes function stores children in '_children' to be used in - toggleNode - later
export const collapseNodes = (node) => {
  if (node.children) {
    console.log("Collapsing node with QAID:", node.data.QAID);
    node._children = node.children; // Store hidden children
    node.children = null; // Collapse node
    node._children.forEach(collapseNodes); // Recursively collapse all children
  }
};

export const updateExpandCollapse = (
  root,
  tree,
  svg,
  g,
  source,
  toggleNode
) => {
  // source = clicked node or initial root when render starts
  console.log("Updating tree layout... Source:", source);
  tree(root); // Recalculate node positions

  const nodes = root.descendants(); // decendents are nodes (children and descendants)
  const links = root.links(); // links are the links between them between nodes

  //Dynamic Scaling
  // SVG is resized based on the tree’s dimensions.
  // Calculatinng the min/max x and y values of all nodes and adjusts the SVG size relative to the window, centering the tree.
  const xExtent = d3.extent(nodes, (d) => d.x); // min and max x coordinates
  const yExtent = d3.extent(nodes, (d) => d.y); // min and max y coordinates
  const svgWidth = yExtent[1] - yExtent[0] + window.innerWidth; // Dynamic width
  const svgHeight = xExtent[1] - xExtent[0] + window.innerHeight; // Dynamic height
  svg.attr("width", svgWidth).attr("height", svgHeight);
  console.log("Svg dimensions: ", svgWidth, svgHeight);

  // Center the tree in the SVG
  const translateX = (svgWidth - (yExtent[1] - yExtent[0])) / 2 - yExtent[0];
  const translateY = (svgHeight - (xExtent[1] - xExtent[0])) / 2 - xExtent[0];
  g.transition()
    .duration(2)
    .attr("transform", `translate(${translateX}, ${translateY})`);

  //ROUTES (LINKS) BETWEEN NODES=
  const link = g.selectAll(".link").data(links, (d) => d.target.data.QAID);
  link
    .enter()
    .append("path")
    .attr("class", "link")
    .merge(link)
    .transition()
    .duration(50)
    .attr(
      "d",
      (d) => `
          M${d.source.y},${d.source.x}
          L${d.source.y + 50},${d.source.x}  
          L${d.source.y + 50},${d.target.x}  
          L${d.target.y},${d.target.x}
        `
    )
    .attr("fill", "none")
    .attr("stroke", "black");

  link.exit().remove();

  //NODES (CIRCLES - change to rect )
  const node = g.selectAll(".node").data(nodes, (d) => d.data.QAID);

  const nodeEnter = node
    .enter()
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
    .attr("fill", (d) => (d.children || d._children ? "blue" : "green"))
    .attr("stroke", "black")
    .attr("stroke-width", 2);

  nodeEnter
    .append("foreignObject")
    .attr("y", 30)
    .attr("x", -50)
    .attr("width", 20)
    .attr("height", 20)
    .append("xhtml:button")
    .attr("class", "toggle-button")
    //styles of the button
    .style("width", "20px")
    .style("height", "20px")
    .style("border", "1px solid black")
    .style("background", (d) => (d.children || d._children ? "grey" : "grey"))
    .style("color", "black")
    .style("cursor", "pointer")
    .text((d) => (d.children || d._children ? "-" : "+"))
    .on("click", (event, d) => {
      event.stopPropagation(); 
      toggleNode(d); 
    });

  //TEXT LABELS===============================================================
  nodeEnter
    .append("text")
    .attr("x", 15)
    .attr("dy", ".35em")
    .text((d) => d.data.Question)
    .attr("font-size", "14px")
    .attr("fill", "black");

  nodeEnter.append("text").attr("x", 15).attr("dy", "1.35em");

  node
    .merge(nodeEnter)
    .transition()
    .duration(50)
    .attr("transform", (d) => `translate(${d.y},${d.x})`);
  node.exit().remove();

  nodes.forEach((d) => {
    // for each node, make the current x and y the previous x and y
    d.x0 = d.x;
    d.y0 = d.y;
  });

  console.log("updateExpandCollapse complete");
};
