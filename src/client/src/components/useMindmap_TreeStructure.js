// This file contains the principal logic for rendering:
// 1. The tree structure of the mindmap using D3.js
// 2. Functionality for collapsing, updating and expanding nodes.
// 3. Dynamically scaling the SVG elements based on node positions
// 4. Interactivity for displaying the side panel to form a question-answer pair between the map and the panel (flashcarding).
// The functions collapseNodes and updateExpandCollapse are exported for usage in runMap.js and mainMap.js.
// ----------------------------------------------------------------------------------------------------------------------------------------

import * as d3 from "d3";

// COLLAPSING THE TREE
export const collapseNodes = (node) => {
  if (node.children) {
    node._children = node.children;
    node.children = null;
    node._children.forEach(collapseNodes);
  }
};

// UPDATE AND EXPAND/COLLAPSE TREE
export const updateExpandCollapse = (
  root,
  tree,
  svg,
  g,
  source,
  toggleNode
) => {
  // Expose root and update function globally for editing
  window.__mindmap_root__ = root;
  window.__mindmap_updateExpandCollapse__ = () =>
    updateExpandCollapse(root, tree, svg, g, source, toggleNode);

  // SVG SIZING AND CENTERING (nodes)
  tree.nodeSize([60, 300])(root);
  const nodes = root.descendants();
  const xExtent = d3.extent(nodes, (d) => d.x);
  const yExtent = d3.extent(nodes, (d) => d.y);
  const svgWidth = yExtent[1] - yExtent[0] + window.innerWidth;
  const svgHeight = xExtent[1] - xExtent[0] + window.innerHeight;
  svg
    .attr("class", "mindmap-svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

  const translateX = (svgWidth - (yExtent[1] - yExtent[0])) / 2 - yExtent[0];
  const translateY = (svgHeight - (xExtent[1] - xExtent[0])) / 2 - xExtent[0];
  g.transition()
    .duration(300)
    .attr("transform", `translate(${translateX}, ${translateY})`);

  // NODE DEFINITION
  const node = g.selectAll(".node").data(nodes, (d) => d.data.QAID);

  // NODE UPDATE POSITION
  const nodeUpdate = node
    .enter()
    .append("g")
    .attr("class", "node")
    .attr(
      "transform",
      (d) => `translate(${source.y0 || d.y},${source.x0 || d.x})`
    );

  // NODE LABEL BOX
  nodeUpdate
    .append("foreignObject")
    .attr("class", "label-fo")
    .attr("x", 0)
    .attr("y", -20)
    .attr("width", 1000)
    .attr("height", 40)
    .append("xhtml:div")
    .attr("class", "label-box")
    .html((d) => d.data.Question)
    .on("click", (event, d) => {
      // SIDE PANEL LOGIC
      if (!!d.parent) {
        event.stopPropagation();
        const sidePanel = document.getElementById("side-panel");
        const sidePanelContent = document.getElementById("side-panel-content");
        if (sidePanel && sidePanelContent) {
          sidePanelContent.innerHTML = `
            <div style="margin-bottom:10px;">${d.data.Answer}</div>
            <br />
            <div>
              <button id="set-question-btn" data-qaid="${d.data.QAID}">Set Question</button>
              <button id="set-answer-btn" data-qaid="${d.data.QAID}">Set Answer</button>
              <br/>
              <input id="edit-text" type="text" style="width:90%;margin-bottom:10px;" placeholder="Enter new value..." />
            </div>
           
          `;
          // Stores the current QAID globally for editing
          window.currentQaid = d.data.QAID;
        }
        sidePanel.style.display = "block";
      }
    });

  // NODE ANIMATION AND TOGGLE BUTTONS
  requestAnimationFrame(() => {
    g.selectAll(".node").each(function (d) {
      const foreignObject = this.querySelector(".label-box");
      if (!foreignObject) return;
      const labelWidth = foreignObject.getBoundingClientRect().width;
      d.visualOffsetY = labelWidth + 10 + 15;
      d3.select(this)
        .select("foreignObject.label-fo")
        .attr("width", labelWidth);
      const group = d3.select(this);

      //TOGGLE BUTTON LOGIC
      const toggles = group.selectAll(".toggle-fo")
        .data((d.children || d._children) ? [d] : [], d => d.data.QAID);

      // Remove old data (old expanded/collapsed button symbol)
      toggles.exit().remove();

      // Insert the new data (expanded.collapses button symbol)
      const toggleEnter = toggles.enter()
        .append("foreignObject")
        .attr("class", "toggle-fo")
        .attr("x", labelWidth + 10)
        .attr("y", -15)
        .attr("width", 30)
        .attr("height", 30);

      toggleEnter.append("xhtml:button")
        .attr("class", "toggle-button")
        .html((d) => (d.children ? "−" : "+"))
        .on("click", (event, d) => {
          event.stopPropagation();
          toggleNode(d);
        });

      // Update the symbols
      group.selectAll(".toggle-button")
        .html((d) => (d.children ? "−" : "+"));
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
    .duration(300)
    .attr("transform", (d) => `translate(${d.y},${d.x})`);

  node.exit().remove();
// NODE TRANSITION
node
  .merge(nodeUpdate)
  .transition()
  .duration(300)
  .attr("transform", (d) => `translate(${d.y},${d.x})`);

node.exit().remove();

// Update label for nodes
g.selectAll(".node").select(".label-box")
  .html((d) => d.data.Question);


  // SAVE NODE POSITIONS
  nodes.forEach((d) => {
    d.x0 = d.x;
    d.y0 = d.y;
  });
};


function updateNodeFieldByQAID(node, qaid, field, value) {
  if (node.data.QAID === qaid) {
    node.data[field] = value;
    return true;
  }
  if (node.children) {
    for (let child of node.children) {
      if (updateNodeFieldByQAID(child, qaid, field, value)) return true;
    }
  }
  if (node._children) {
    for (let child of node._children) {
      if (updateNodeFieldByQAID(child, qaid, field, value)) return true;
    }
  }
  return false;
}

if (!window.mindmapEditListener) {
  window.mindmapEditListener = true;
  document.addEventListener("click", function (event) {
    if (event.target.id === "set-question-btn" || event.target.id === "set-answer-btn") {
      const qaid = event.target.getAttribute("data-qaid");
      const field = event.target.id === "set-question-btn" ? "Question" : "Answer";
      const value = document.getElementById("edit-text").value;
      
      //Updating the node question text
      if (value && window.mindmapRoot) { // if theres text in the field and the map has a root (aka it exists)
        updateNodeFieldByQAID(window.mindmapRoot, qaid, field, value);
        if (window.mindmap_updateExpandCollapse) {
          window.mindmap_updateExpandCollapse();
        }

        // Updating the side panel answer text
        if (field === "Answer") {
          document.getElementById("side-panel-content").querySelector("div").innerText = value;
        }
         document.getElementById("edit-text").value = "";
      }
    }
  });
}