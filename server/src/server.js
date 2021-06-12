'use strict';

const express = require('express');
const { MongoClient } = require("mongodb");

// Connection URI
const uri = "mongodb://mongodb:27017";
// Create a new MongoClient
const client = new MongoClient(uri);
async function run() {
  try {
    // Connect the client to the server
    await client.connect();
    // Establish and verify connection
    await client.db("admin").command({ ping: 1 });
    console.log("Connected successfully to server");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);

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
