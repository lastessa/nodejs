'use strict';

const express = require('express');

// Constants for starting
const PORT = 8082;
const HOST = '0.0.0.0';

// App
const app = express();
app.get('/', (req, res) => {
  res.send('Hello world node js1\n');
  res.send(server.address());
});

app.listen(PORT, HOST);
console.log(`Running on server http://${HOST}:${PORT}`);
