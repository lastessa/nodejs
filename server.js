'use strict';
var os = require('os'); 
const express = require('express');

// Constants for starting
const PORT = 8082;
const HOST = '0.0.0.0';

// App
const app = express();


app.get('/', (req, res) => {
  //res.send('k8s pod is OK\n');
  var os = require('os'); 
  res.send('my hostname' os.hostname() );
});

app.listen(PORT, HOST);
console.log(`Running on server http://${HOST}:${PORT}`);
