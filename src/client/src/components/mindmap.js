// Okay so I have to make sure i keep track for later so for oritenting in the code read as follows:
// Numbering is used to sign post steps for what is happening - one part to remember
// Entering new sections (signposted by ALL CAPS) will start the numbring again
// IF YOU GET LOST - start from the numbers and follow the steps - closed backets end the section 
// this might make numbering look weird at first but it works - trust me (yourself lol). 

//IMPORTS 
// 1) Import react with hooks:
// 2) useEffect - lets me run extra code even after the component is rendered
// 3) userRef - allows me to refernece Dom elements - in my case the svg element that contains my map 
// 4) Import d3:
// 5) import * as d3 from "d3" - the visualisation library for the mindmap - allows me to make a tree 


import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

// MINDMAP DEFINITION
// 1) React component MindMap - must contain hierachial "data" as a prop to work
// 2) svgRef - references the svg where d3 can render the map
const MindMap = ({ data }) => { //1
  const svgRef = useRef(); //2

  // USEEFFECT
  // 1) useEffect - runs after the component is rendered

  useEffect(() => {
    // return if thers no data 
    if (!data) return; //

    // TREE SETUP
    // 1) Define the root using d3 hierachy   populate with prop data
    // 2) Define the tree using d3 tree - set the tree size
    // 3) Populate the tree with the data (prop) using the tree object

    const root = d3.hierarchy(data); //1 // json into d3 format https://d3js.org/d3-hierarchy/hierarchy
    const tree = d3.tree().size([dimensions.width -100 , dimensions.height -100]); //2 dimensions of the tree
    tree(root); //3 a tree with the route data
    
     // SVG SETUP
     //1) sets dimensions for the svg element
     // 2) sets the pointer to the svg element in the DOM using svgRef and d3.select
     // 3) sets the width and height of the svg element
     // 4) sets the background color of the svg element

    const dimensions = { width:800, height:800 }; //1
    const svg = d3.select(svgRef.current) //2
        .attr("width", dimensions.width) //3
        .attr("height", dimensions.height) //3
        .style("background-color", "1px solid black"); //4

    // ROUTES - lines - BETWEEN NODES
    // 1) Define the lines between the nodes
    // 2) Create positional data for the lines
    // 3) Set the stroke color of the lines
    
    svg.selectAll("line") //1
        .data(root.links()) //1
        .enter().append("line") //1
        .attr("x1", d => d.source.x + 50) //2
        .attr("y1", d => d.source.y + 50) //2
        .attr("x2", d => d.target.x + 50)  //2
        .attry("y2", d = d.target.y + 50)  //2
        .attr("stroke", "black"); //3

    // NODES - CIRCLES - FOR EACH NODE (this is the chidlren of the root)
    // 1) Define the nodes
    // 2) Create positional data for the nodes
    // 3) Set the fill color of the nodes
    // 4) Set the stroke color of the nodes
    // 5) Set the stroke width of the nodes
    // 6) Set the radius of the nodes

    svg.selectAll("circle") //1
        .data(root.descendants()) //1
        .enter().append("circle") //1
        .attr("cx", d => d.x + 50) //2
        .attr("cy", d => d.y + 50) //2
        .attr("fill", "white") //3
        .attr("stroke", "black") //4
        .attr("stroke-width", 2) //5
        .attr("r", 20); //6

    // TEXT - LABELS - FOR EACH NODE
    // 1) Define labels
    // 2) Create positional data for labels
    // 3) Set the text for the labels
    // 4) Set the text anchor of the labels
    // 5) Allign the labels to the middle 
    // 6) Ajust the the font size and colour of the labels

    
    svg.selectAll("text") //1
    .data(root.descendants())//1
    .enter().append("text") //1

    .attr("x", d => d.x + 60) //2
    .attr("y", d => d.y + 50) //2

    .text(d => d.data.name) //3

    .attr("text-anchor", "middle") //4
    .attr("alignment-baseline", "middle") //5
    .attr("font-size", "12px") //6
    .attr("fill", "black"); //6
    
  }, [data]); //1 - renders when the prop (data) changes

  return <svg ref={svgRef}></svg>;
};

export default MindMap;
