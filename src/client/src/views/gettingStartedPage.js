import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LogoutButton from "../components/logout.js"; // for logout button
import Waves from "../components/waves.js";
import { handleFileUpload } from "../utils/uploadFiles.js";
const logoPng = process.env.PUBLIC_URL + "/android-chrome-192x192.png";

// This page renders getting started page. It includes the logo, welcome message, session info and currently only the output button (update tomorrow with entry form - file upload or text input).
const GettingStarted = ({ user, setUser }) => {
  // PROJECT TITLE + PROMPT )
  const [title, setTitle] = useState("");
  const [prompt, setPrompt] = useState("");
  // FILE CONTENT + FILESIZE WARNING 
  const [fileContent, setFileContent] = useState("");
  const [filesizeWarning, setFilesizeWarning] = useState("");
  const navigate = useNavigate();

  // GENERATE MAP FUNCTION - on button click
  const generateMap = () => {
    const context = fileContent || prompt;
    navigate("/generate-map", { state: { context, title } });
  };

  // FILE UPLOAD FUNCTION - uploadFiles.js)
  const characterLimit = 1000;
  const uploadFile = (e) => {
    handleFileUpload(
      e.target.files[0],
      characterLimit,
      setFilesizeWarning,
      setFileContent
    );
  };

  // REMOVE FILE FUNCTION - on button click
  const removeFile = () => {
    setFileContent("");
  };

  // RENDER GETTING STARTED PAGE with WelcomePage structure, NO links to other pages
  return (
    <div className="aurora-bg">
      <div className="backdrop">
        <div className="main-logo">
          <a href="/">
            <p>Map-Recallis</p>
            <img src={logoPng} alt="Map-Recallis Logo" />
            <p>Conjugate Learning</p>
          </a>
        </div>
        <div className="main-menu">
          {/* PROJECT TITLE */}
          <h2 className="main-menu-header">Project Title</h2>
          <textarea
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter the title of your project..."
            style={{
              height: 50,
              width: 400,
              padding: 8,
              fontSize: 16,
              resize: "vertical",
              overflow: "auto",
              boxSizing: "border-box",
              verticalAlign: "top",
            }}
          />
          <br />
          {/* PROJECT PROMPT */}
          <h2>Project prompt</h2>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter the prompt for the mind map..."
            disabled={!!fileContent}
            style={{
              height: 300,
              width: 400,
              padding: 8,
              fontSize: 16,
              resize: "vertical",
              overflow: "auto",
              boxSizing: "border-box",
              verticalAlign: "top",
              backgroundColor: fileContent ? "#eee" : "white",
            }}
          />
          <br />
          {/* FILE UPLOAD */}
          <h2>Upload a file</h2>
          {filesizeWarning && (
            <p style={{ color: "red", marginTop: 5 }}>{filesizeWarning}</p>
          )}
          <input
            type="file"
            accept=".txt,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/pdf"
            onChange={uploadFile}
          />{" "}
          You can upload .txt, doc, docx, pdf
          {fileContent && (
            <>
              {fileContent && (
                <div style={{ marginTop: 5, color: "#333" }}>
                  File length: {fileContent.length} characters
                </div>
              )}
              <br />
              <button onClick={removeFile}>Remove file</button>
            </>
          )}
          <br />
          {/* GENERATE BUTTON */}
          <button
            onClick={generateMap}
            disabled={!title.trim() || (!prompt.trim() && !fileContent)}
          >
            Generate MindMap
          </button>
          {user && (
            <p>
              Logged in as: {user.username} | <LogoutButton setUser={setUser} />
            </p>
          )}
        </div>
        <footer className="footer">
          <p>Created by: Noah Tambala (ntamb002)</p>
        </footer>
      </div>
      <Waves />
    </div>
  );
};

export default GettingStarted;