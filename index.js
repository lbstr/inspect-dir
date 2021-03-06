// Config
var config = require('./config');

// Services
var DirectoryService = require('./services/DirectoryService');
var directoryService = new DirectoryService(config.BASE_DIRECTORY);

// Express
var express = require('express');
var app = express();

// Routing
var router = express.Router();

router.get('/files', function(req, res, next) {
  directoryService.getFileMeta()
    .then(function(fileMeta){
      res.json(fileMeta);
    })
    .fail(function(err) {
      next(err);
    });
});

app.use('/', router);

// Error handling
app.use(function(err, req, res, next) {
  console.error(err);
  res.status(500).send('Something broke!');
});

// Port binding
app.listen(config.PORT);
console.log("Listening on port %d", config.PORT);