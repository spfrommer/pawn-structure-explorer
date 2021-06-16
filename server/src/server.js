const express = require('express');
const Database = require('./database');

const uri = 'mongodb://mongodb:27017'; // Connects to mongodb container
const pgnsDir = '/pgns'; // Mapped as volume in docker-compose
const db = new Database(uri, pgnsDir);

const app = express();
app.get('/api/pieceLocs', (req, res) => {
    db.getPieceLocs(req.query.structure)
        .then(doc => {
            console.log(`Got pieceLocs request ${req.query.structure}`);
            res.json(doc);
        })
        .catch(err => {
            console.error(err);
            res.send('ERROR');
        });
});

app.get('/api/index', (req, res) => {
    db.buildIndex()
        .then(() => {
            console.log('Got indexing request');
            res.send('INDEXED');
        })
        .catch(err => {
            console.error(err);
            res.send('ERROR');
        });
});
app.get('/api/first', (req, res) => {
    db.findAll()
        .then(docs => {
            res.send(`<pre> ${JSON.stringify(docs[0], null, 4)} </pre>`);
        })
        .catch(err => {
            console.error(err);
            res.send('ERROR');
        });
});
app.get('/api/stats', (req, res) => {
    db.stats()
        .then(stats => {
            res.send(`<pre> ${JSON.stringify(stats, null, 4)} </pre>`);
        })
        .catch(err => {
            console.error(err);
            res.send('ERROR');
        });
});
app.get('/api/drop', (req, res) => {
    db.drop()
        .then(() => { res.send('DROPPED'); })
        .catch(err => {
            console.error(err);
            res.send('ERROR');
        });
});

app.listen(8081, '0.0.0.0');
console.log('Server running');
