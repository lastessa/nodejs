'use strict';
var os = require('os'); 
const express = require('express');

// Constants for starting
const PORT = 8082;
const HOST = '0.0.0.0';

// Appasd
const app = express();


app.get('/', (req, res) => {
  var os = require('os'); 
  //res.send(os.hostname());
  res.send('swarm balancer pod is OK\n');
});

app.listen(PORT, HOST);
console.log(`Running on server http://${HOST}:${PORT}`);
