import React from "react";
import { Link } from "react-router-dom";
import WaveSVG from "../components/waves.js";

const AboutPage = () => (
  <div className="aurora-bg">
    <div className="backdrop">
      <div className="main-menu">
        <div className="main-menu-header">
          <h1>About Map-Recallis</h1>
        </div>
        <div>
          <p>
            <b>Map-Recallis</b> is an <b>AI powered tool</b> designed to assist your learning and revision using <b>mindmaps</b> and <b>active recall</b>.
            <br />
            <b>AI</b> generates <b>question-answer pairs</b> from your text, building a <b>hierarchical mindmap</b> that mirrors the structure of the text.
            <br /> This application is in BETA and some features may be incomplete. For enquires, please contact the developer email listed at the footer of this page.
            <br /> <br />
          </p>
          <p>
            <b>Features:</b>
            <ul>
              <li><b>Automatic mindmap generation</b> from your notes or pasted text <span style={{fontWeight: 600}}>(BETA - results may vary)</span></li>
              <li><b>Demo mode</b> lets you explore with <b>preset prompts</b> for quick map generation</li>
              <li><b>Practice Active Recall</b> with <b>question-answer nodes</b></li>
              <li><b>Download</b> your maps as <b>Json</b></li>
              <li><b>Save</b> your maps within Map-Recallis <span style={{fontWeight: 600}}>(BETA - View saved maps Coming soon)</span></li>
            </ul>
            <b>How to use:</b>
            <ul>
              <li><b>Login</b> or <b>register</b> and go to the <b>Getting Started</b> page</li>
              <li>Give a <b>title</b> for your map's root node, <b>paste text</b> into the text box (recommended) or <b>Upload a File</b></li>
              <li>Click <b>"Generate Map"</b> to create your mindmap!</li>
              <li>Explore the <b>generated map</b> and practice <b>active recall</b> for your revision</li>
              <li>Click the <b>nodes</b> to view the <b>question-answer pairs</b></li>
              <li>Use <b>set question</b> and <b>set answer</b> in the side panel to adjust the question-answer pairs</li>
              <li><b>Download</b> your map as a <b>Json file</b> for later use</li>
              <li><b>Save</b> your map to your account <span style={{fontWeight: 600}}>(Logged in only - BETA - View saved maps Coming soon)</span></li>
            </ul>
            <b>Notice:</b> The <b>AI module</b> is still in development - maps produced may vary in <b>accuracy</b> and/or <b>relevance</b>. Generated maps are intended to be used as a <b>starting point</b> to support your own learning and revision. Please use <b>Map-Recallis</b> at your own discretion.
          </p>
          <p>
            <b>Created by:</b> Noah Tambala (ntamb002) <br />
            <b>Contact:</b> ntamb002@gold.ac.uk
          </p>
          <p>
            <Link to="/" className="theme-btn">Back to Home</Link>
          </p>
        </div>
      </div>
      <footer className="footer">
        <p>Map-Recallis</p>
        <p>Created by: Noah Tambala (ntamb002)</p>
        <p>Contact: ntamb002@gold.ac.uk</p>
      </footer>
    </div>
    <WaveSVG />
  </div>
);

export default AboutPage;