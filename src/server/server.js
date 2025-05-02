//Imports
require('dotenv').config(); // loading initial crenditials from .env - *kept a copy*
const mysql = require('mysql2'); // enables connection to mysql database
const express = require('express'); // for server creation/routes
const session = require('express-session'); // session management
const cors = require('cors'); //cross origin requests - between server/python and react frontend
const bodyParser = require('body-parser'); // parsing json and text bodies
const usersRoutes = require('./users'); // routes for user management (login, register, logout)
//
const app = express();
const port = process.env.PORT || 3001;
const { executeMindmapProcess} = require('./mindmapProcess');

//Middleware
app.use(cors({
  origin: 'http://localhost:3002', // front end orgin
  credentials: true, // credentials to be sent with requests 
})); // cross origin requests - because i made the back and front end run on different ports it just wrorks

app.use(bodyParser.json()); // allow json to be sent through bodies (Post /api/mindmap - see also fetch in App.js)
app.use(express.text()); // allows plaintext to be sent through request bodies (Post /api/mindmap - see also fetch in App.js)

app.use(
    session({
      secret: 'secret',
      resave: false,
      saveUninitialized: true,
      cookie: { secure: false },
    })
  );
  

//Defining of the admin user credentials (check .env if I forget)
const host = process.env.HOST;
const user = process.env.USER;
const password = process.env.PASSWORD;
const database = process.env.DATABASE;

// Seting up the connection to mysql using the user credentials
const connection = mysql.createConnection({
    host: host,
    user: user,
    password: password,
    database: database
});
// Connecting using the connection object
connection.connect(err => {
    if(err) {
        console.error('Unsuccessful: error connecting to mysql: ', err);
    }  else {
        console.log('Successful: connected to mysql');
    }
});

//Routes
app.get('/', (req, res) => { //Default route is / - going to localhost:7000/ will res.send the message
    res.send('Server is running on port: ' + port);
});
// Using app.listen to start the server on port (specified in the env or by 7000)
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
app.use('/api/users', usersRoutes(connection)); // pointing to the routes from users.js - can pass connection objects to it - login, register and logout routes are defined here

// Post route sents plaintext from the body to be processed by mindmapProcess.js - this calls components.py - retuning a json response to the react frontend
app.post("/api/mindmap", async (req, res) => {
    const plainText = req.body; // get the plaintext from the body of the request (see also fetch in App.js)
    try {
      const result = await executeMindmapProcess(plainText);
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.toString() }); //  fails if the python script does not run correctly - 500 *remember 500 is internal*
    }

});
  