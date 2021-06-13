'use strict';

const express = require('express');
const Database = require('./database.js');

const uri = "mongodb://mongodb:27017"; // Connects to ongodb container
const pgnsDir = "/pgns"; // Mapped as volume in docker-compose
const db = new Database(uri, pgnsDir);

db.indexPgnFile(db.pgnFiles()[0]);

// App
const app = express();
app.get('/api/index', (req, res) => {
    console.log('INDEXING');
    res.send('INDEXING');

    // db.indexPgnFile(db.pgnFiles()[0]);
});

app.listen(8081, '0.0.0.0');
console.log('Server running');