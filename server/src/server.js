'use strict';

const express = require('express');

// Constants
const PORT = 8081;
const HOST = '0.0.0.0';

// App
const app = express();
app.get('/', (req, res) => {
  res.send('Hello World');
});
app.get('/api', (req, res) => {
  console.log('Got api request');
  res.send('API test');
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
