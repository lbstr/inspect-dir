var finalhandler = require('finalhandler');
var http = require('http');
var router = require('router')();
var directoryService = require('./directoryService.js');

router.get('/', function(req, res) {
  var files = directoryService.getFiles(__dirname);

  sendJson(files, res);
});

function sendJson(obj, res) {
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(obj, null, 2));
}

var server = http.createServer(function(req, res) {
  router(req, res, finalhandler(req, res));
});

server.listen(8123);