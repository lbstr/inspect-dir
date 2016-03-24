// Services
var directoryService = require('./services/directoryService');

// Express
var express = require('express');
var app = express();

app.get('/', function(req, res) {
  var targetDirectory = __dirname;
  var files = directoryService.getFiles(targetDirectory);

  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(files, null, 2));
});

app.listen(8123);