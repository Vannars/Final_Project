// useMindmap_ExectuteMain.js
import React, { useRef } from "react";
import useMindMap from "./useMindmap_Main"; 

const MindMap = ({ data }) => {
  const svgRef = useRef();
  useMindMap(svgRef, data); 
  return <div>
    <svg ref={svgRef} className="mindmap-svg"></svg>
    </div>;
};
    
export default MindMap;
