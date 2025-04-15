1) Local environment setup

- In the root folder: 
  Install node.js https://nodejs.org/

- Check node versions in terminal:
   node-v
   npm -v

- Install python 3 for the NLP https://www.python.org/downloads/
- In the server folder: 
  npm install express mysql mysql2 body-parser cors


- In the client folder:
  npm install d3


2) How to run server:
- In the terminal from the root type  
   cd src
   cd server
   node server.js

-  open a web browser and goto:
   http://localhost:7000/

-  Text should display the following message:
   Server is running on port()


3) Running python component:
-  In the terminal type:
   .\venv\Scripts\activate

   then type:
   python components.py
   
- Output should show from the test cases in the terminal
