// Config
var env = process.env.NODE_ENV || 'development';
var Config = require('./config');
var config = Config(env);

// Services
var directoryService = require('./services/directoryService');

// Express
var express = require('express');
var app = express();

// Routing
var router = express.Router();

router.get('/', function(req, res) {
  var files = directoryService.getFiles(config.BASE_DIRECTORY);

  res.json(files);
});

app.use('/api', router);

// Port binding
app.listen(config.PORT);