// This module runs a script that recieves plaintext from the server and sends it as input to component.py python script.
// The output of this module is a JSON object containing the question/answer pairs with their respective IDs/children.
// This output is intended to be sent in a response via the sever in the post route /api/mindmap for the react front to render the mindmap.

// Imports
const { spawn } = require("child_process"); //  Spawn for running the python script and returning a promise when done.
const path = require("path"); //  Path for relative paths to navigate towards python.exe and the components.py.

// Pathways
const python_exe = path.join(
  __dirname,
  "..",
  "python",
  "venv", // must use this as spaCY is installed in the venv ONLY
  "Scripts",
  "python.exe"
); 
const scriptPath = path.join(__dirname, "..", "python", "main.py");

// Main execution 
function executeMindmapProcess(inputText) {
  return new Promise((resolve, reject) => { // waiting for components.py JSON response
    // Process start/spawn whatever you wanna call it 
    const pyProc = spawn(python_exe, [scriptPath, inputText]); // runs component.py using python.exe and the paths aboves
    let res = "";
    let err = "";
    // using stdout for good things and stderr for very bad things (error handling)
    pyProc.stdout.on("data", (data) => { //output retuned
      res += data.toString(); 
    });

    pyProc.stderr.on("data", (data) => { // error returned
      err += data.toString();
    });

    // Process end - closing the process
    pyProc.on("close", (code) => { // when finished - the process ends
      if (code !== 0) {
        reject(`Python script exited with code ${code}: ${err}`); // if it fails it returns and error
      } else { // if it succeeds it returns the result
        try {
          const parsed = JSON.parse(res); // hopefully
          resolve(parsed); // promise resolved (love it when I keep my promises)
        } catch (parseErr) {
          reject(
            `Failed to parse JSON: ${parseErr.message} \n Raw output: ${res}` // otherise erorr its been rejected :(
          );
        }
      }
    });
  });
}

// UNIT TEST minmapProcess.js
// The purpose of this test is to assure that mindmapProcess.js is working correctly.
// It runs only if when run directly - not when imported by server.js
// The text is dummy - googled who Leonardo da Vinci is - the output is successful if it returns a JSON object with the question/answer pairs and their respective IDs/children.
if (require.main === module) {
  const testInput = "The answer to life the universe and everything is 42. This is a quote comes from the Hitchhikers guide to the galaxy by Douglas Adams.";

  console.log("Running test for executeMindmapProcess...");
  executeMindmapProcess(testInput)
    .then((output) => {
      console.log(" Success! Parsed JSON output:");
      console.dir(output, { depth: null, colors: true }); // stands out for readability
    })
    .catch((err) => {
      console.error(" Error:");
      console.error(err);
    });
}

module.exports = { executeMindmapProcess };
