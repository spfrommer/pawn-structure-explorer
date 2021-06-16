const express = require('express');
const Database = require('./database');

const uri = 'mongodb://mongodb:27017'; // Connects to mongodb container
const pgnsDir = '/pgns'; // Mapped as volume in docker-compose
const db = new Database(uri, pgnsDir);

const app = express();
app.get('/api/pieceLocs', (req, res) => {
    db.getPieceLocs(req.query.structure)
        .then(doc => {
            res.json(doc);
        })
        .catch(err => res.send(err));
});
app.get('/api/games', (req, res) => {
    db.getGames(req.query.structure)
        .then(doc => {
            res.json(doc);
        })
        .catch(err => res.send(err));
});
app.get('/api/pieceLocs/first', (req, res) => {
    db.findAllPieceLocs()
        .then(docs => {
            res.send(`<pre> ${JSON.stringify(docs[0], null, 4)} </pre>`);
        })
        .catch(err => res.send(res.send(JSON.stringify(err, null, 4))));
});
app.get('/api/games/first', (req, res) => {
    db.findAllGames()
        .then(docs => {
            res.send(`<pre> ${JSON.stringify(docs[0], null, 4)} </pre>`);
        })
        .catch(err => res.send(JSON.stringify(err, null, 4)));
});
app.get('/api/gamePgn/first', (req, res) => {
    db.findAllGamePgn()
        .then(docs => {
            res.send(`<pre> ${JSON.stringify(docs[0], null, 4)} </pre>`);
        })
        .catch(err => res.send(res.send(JSON.stringify(err, null, 4))));
});

app.get('/api/index', (req, res) => {
    db.buildIndex()
        .then(() => { res.send('INDEXED'); })
        .catch(err => {
            console.log(err);
            res.send(err);
        });
});
app.get('/api/drop', (req, res) => {
    db.drop()
        .then(() => { res.send('DROPPED'); })
        .catch(err => res.send(err));
});
app.get('/api/stats', (req, res) => {
    db.stats()
        .then(stats => {
            res.send(`<pre> ${JSON.stringify(stats, null, 4)} </pre>`);
        })
        .catch(err => res.send(err));
});

app.listen(8081, '0.0.0.0');
console.log('Server running');
