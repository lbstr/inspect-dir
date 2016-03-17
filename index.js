var finalhandler = require('finalhandler');
var http = require('http');
var router = require('router')();

router.get('/', function (req, res) {
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.end('Hello World!');
});

var server = http.createServer(function(req, res) {
  router(req, res, finalhandler(req, res));
});

server.listen(8123);