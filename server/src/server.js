const express = require('express');
const Database = require('./database');

const uri = 'mongodb://mongodb:27017'; // Connects to mongodb container
const pgnsDir = '/pgns'; // Mapped as volume in docker-compose
const db = new Database(uri, pgnsDir);

const app = express();

function errorHandle(res, err) {
    console.error(err);
    res.send('ERROR');
}

function time() {
    return new Date().getTime();
}

app.get('/api/pieceLocs', (req, res) => {
    db.getPieceLocs(req.query.structure)
        .then(doc => { res.send(doc); })
        .catch(errorHandle.bind(res));
});
app.get('/api/games', (req, res) => {
    const startTime = time();
    console.log('Got games request');
    db.getGames(req.query.structure)
        .then(doc => {
            console.log(`Sending games response: ${time() - startTime}`);
            res.send(doc);
            console.log(`Finished sending: ${time() - startTime}`);
        })
        .catch(errorHandle.bind(res));
});
app.get('/api/gamePgn', (req, res) => {
    db.getPgn(req.query.gameId)
        .then(doc => { res.send(doc); })
        .catch(errorHandle.bind(res));
});
app.get('/api/pieceLocs/first', (req, res) => {
    db.findAllPieceLocs()
        .then(docs => {
            res.send(`<pre> ${JSON.stringify(docs[0], null, 4)} </pre>`);
        })
        .catch(errorHandle.bind(res));
});
app.get('/api/games/first', (req, res) => {
    db.findAllGames()
        .then(docs => {
            res.send(`<pre> ${JSON.stringify(docs[0], null, 4)} </pre>`);
        })
        .catch(errorHandle.bind(res));
});
app.get('/api/gamePgn/first', (req, res) => {
    db.findAllGamePgn()
        .then(docs => {
            res.send(`<pre> ${JSON.stringify(docs[0], null, 4)} </pre>`);
        })
        .catch(errorHandle.bind(res));
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
