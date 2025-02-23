require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');   
const mysql = require('mysql2');
const app = express();
const port = process.env.PORT || 7000;

app.use(cors());
app.use(bodyParser.json());


// Defining database user credentials - dotenv hides the exact values of these for best practices
const host = process.env.HOST;
const user = process.env.USER;
const password = process.env.PASSWORD;
const database = process.env.DATABASE;

// Defining const connection onject to connect to mysql using the user credentials
const connection = mysql.createConnection({
    host: host,
    user: user,
    password: password,
    database: database
});
// connecting to the database using the connection object
connection.connect(err => {
    if(err) {
        console.error('Unsuccessful: error connecting to mysql: ', err);
    }  else {
        console.log('Successful: connected to mysql');
    }
});

//Default route is / - going to localhost:7000/ will res.send the message
app.get('/', (req, res) => {
    res.send('Server is running on port ' + port);
});
// Using app.listen to start the server on port (specified in the env or by 7000)
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});