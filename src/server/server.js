const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');   
const mysql = require('mysql2');
const app = express();
const port = process.env.PORT || 7000;

app.use(cors());
app.use(bodyParser.json());

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'maprecallis_app',
    password: 'cjnotes32!',
    database: 'maprecallis'
});

connection.connect(err => {
    if(err) {
        console.error('Unsuccessful: error connecting to mysql: ', err);
    }  else {
        console.log('Successful: connected to mysql');
    }
});

app.get('/', (req, res) => {
    res.send('Server is running on');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});