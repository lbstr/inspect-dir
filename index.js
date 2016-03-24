var finalhandler = require('finalhandler');
var http = require('http');
var router = require('router')();
var directoryService = require('./services/directoryService');



router.get('/', function(req, res) {
  var targetDirectory = __dirname;
  var files = directoryService.getFiles(targetDirectory);

  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(files, null, 2));
});




var server = http.createServer(function(req, res) {
  router(req, res, finalhandler(req, res));
});

server.listen(8123);


/*

Where to define:
  port
  targetDirectory

*/