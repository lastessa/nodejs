'use strict';
var os = require('os'); 
const express = require('express');

// Constants for starting
const PORT = 8082;
const HOST = '0.0.0.0';

// App
const app = express();


app.get('/', (req, res) => {
  var os = require('os'); 
  //asd
  //res.send(os.hostname());
  res.send('swarm balancer pod is OK\n');
});

app.listen(PORT, HOST);
console.log(`Running on server http://${HOST}:${PORT}`);
