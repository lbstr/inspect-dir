// Services
var directoryService = require('./services/directoryService');

// Express
var express = require('express');
var app = express();

app.get('/', function(req, res) {
  var targetDirectory = __dirname;
  var files = directoryService.getFiles(targetDirectory);

  res.json(files);
});

app.listen(8123);