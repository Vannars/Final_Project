import React, {useRef} from React;
import {useMindMap} from './runMap'; 

const MindMap = ({ data}) => {
    const svgRef = useRef();
    useMindMap(svgRef, data); 
    return <svg ref={svgRef}></svg>;}
    export default MindMap;