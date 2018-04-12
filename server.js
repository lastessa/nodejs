'use strict';

const express = require('express');

// Constants for starting
const PORT = 8081;
const HOST = '0.0.0.0';

// App
const app = express();
app.get('/', (req, res) => {
  res.send('Hello world node js1\n');
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
