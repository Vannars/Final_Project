import React, { useRef } from "react";
import useMindMap from "./useMindmap_Main"; 

const MindMap = ({ data }) => {
  const svgRef = useRef();
  useMindMap(svgRef, data); 
  return <div className="mindmap-scroll">
    <svg ref={svgRef} className="mindmap-svg"></svg>
    </div>;
};
    
export default MindMap;
