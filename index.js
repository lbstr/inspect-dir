// Config
var config = require('./config');

// Services
var FileService = require('./services/FileService');
var fileService = new FileService(config.BASE_DIRECTORY);

// Express
var express = require('express');
var app = express();

// Routing
var router = express.Router();

router.get('/', function(req, res) {
  var files = fileService.getAll();

  res.json(files);
});

app.use('/', router);

// Port binding
app.listen(config.PORT);
console.log("Listening on port %d", config.PORT);