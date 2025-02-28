//IMPORTS
import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

//MINDMAP DEFINITION
const MindMap = ({ data }) => {
  console.log("Data for the map exists as: ", data); // test to see if the data is passed to the mindmap component
  //1
  const svgRef = useRef(); //2
  //USEEFFECT
  useEffect(() => {
    console.log("useEffect triggered");
    if (!data) return; // return if there's no data

    //TREE SETUP
    const root = d3.hierarchy(data); //1 - Convert JSON into D3 hierarchy https://d3js.org/d3-hierarchy/hierarchy
    console.log("Root is: ", root); // test to see if the root is created

    const tree = d3.tree().size([800 - 100, 800 - 100]); //2 - Tree layout size
    tree(root); //3 - Apply tree layout to root
    console.log("Tree layout is: ", root.descendants()); // is the tree applied to the root?

    //COLLAPSING THE TREE
    const collapseNodes = (node) => {
      if (node.children) {
        
        console.log("Collapsing node with QAID:", node.data.QAID);
        node._children = node.children; //2 - Store hidden children
        node.children = null; // Collapse node
        node._children.forEach(collapseNodes); // Collapse recursively
      }
    };

    root.children.forEach(collapseNodes); // Collapse all children initially

    //SVG SETUP
    const svg = d3
      .select(svgRef.current) //2 - Select SVG
      .attr("width", 800) //3 - Width
      .attr("height", 800) //3 - Height
      .style("border", "1px solid black"); //3 - Border

    svg.selectAll("*").remove(); // Clear previous tree

    // FUNCTION TO UPDATE TREE WHEN EXPANDING/COLLAPSING
    const updateExpandCollapse = (source) => {
      console.log("Updating tree layout... Source:", source);
      tree(root); // Recalculate positions of the nodes at the start of each render

      // ROUTES - LINES - BETWEEN NODES
      const link = svg // this defines links
        .selectAll(".link")
        .data(root.links(), (d) => d.target.data.QAID);

      link // while this decides where the links go
        .enter()
        .append("line") // append is needed to add a new element to a dom
        .attr("class", "link") // link - is its own class - all links between nodes will have these attributes
        .merge(link)
        .attr("x1", (d) => d.source.y + 25)
        .attr("y1", (d) => d.source.x + 25)
        .attr("x2", (d) => d.target.y + 25)
        .attr("y2", (d) => d.target.x + 25)
        .attr("stroke", "black");

      link.exit().remove(); // removes contextually reduntant links during the render

      // NODES - CIRCLES - FOR EACH NODE (this is the children of the root)
      // 1) Define the nodes
      // 2) Create positional data for the nodes
      // 3) Set the fill color of the nodes
      // 4) Set the stroke color of the nodes
      // 5) Set the stroke width of the nodes
      // 6) Set the radius of the nodes

      const node = svg // nodes are svg elements
        .selectAll(".node") // selects all elements with the class node
        .data(root.descendants(), (d) => d.data.QAID); //QAID aka Question Answer ID... (note that deceandants is defined in d3 it just refers to children of the node)

      const nodeEnter = node
        .enter() // .enter is defined in d3
        .append("g") //
        .attr("class", "node") // shares the same node class
        .attr("transform", (d) => `translate(${d.y + 25},${d.x + 25})`) // entering a node tranlates it in the xy plane (moves it)
        .on("click", (event, d) => toggleNode(d)); // this occurs on click (java flashbacks)

      nodeEnter
        .append("circle")
        .attr("r", 10)
        .attr("fill", (d) =>
          d.children || d._children ? "blue" : "green"
        )
        .attr("stroke", "black") 
        .attr("stroke-width", 2);

      // TEXT - LABELS - FOR EACH NODE
      nodeEnter
        .append("text")
        .attr("x", 15)
        .attr("dy", ".35em")
        .text((d) => d.data.Question) //3 - Question label
        .attr("font-size", "12px")
        .attr("fill", "black");

      node.exit().remove(); // this
      console.log("updateExpandCollapse complete");
    };
    //FUNCTION TO TOGGLE NODE (EXPAND/COLLAPSE)
    const toggleNode = (d) => {
      console.log("Toggling node with QAID:", d.data.QAID);
      if (d.children) {
        d._children = d.children; // Store hidden children
        d.children = null; // Collapse node
      } else {
        d.children = d._children; // Expand node
        d._children = null;
      }
      updateExpandCollapse(d); // Re-render tree
      console.log("Toggle node: ", d); 
    };

    updateExpandCollapse(root); // This is the first render of the map
    console.log("Initial render: done"); // initial render done
  }, [data]); //1 - Runs whenever `data` changes

  console.log("Rendering MindMap component"); // log component render
  return <svg ref={svgRef}></svg>; // SVG element for D3 rendering
};

export default MindMap;
