'use strict';

const express = require('express');
const Database = require('./database.js');

const uri = "mongodb://mongodb:27017"; // Connects to ongodb container
const pgnsDir = "/pgns"; // Mapped as volume in docker-compose
const db = new Database(uri, pgnsDir);

// App
const app = express();
app.get('/api/index', async (req, res) => {
    db.buildIndex()
        .then(() => { res.send('INDEXED'); })
        .catch((err) => { 
            console.error(err);
            res.send('ERROR');
        })
});

app.get('/api/')

app.listen(8081, '0.0.0.0');
console.log('Server running');