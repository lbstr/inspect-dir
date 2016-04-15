var fs = require('fs');
var crypto = require('crypto');
var path = require('path');
var Q = require('q');

module.exports = FileService;

function FileService() {
  return {
    getMeta: getMeta
  };

  function getMeta(filePath) {
    var dfd = Q.defer();

    fs.stat(filePath, function(err, stats) {
      if (err) {
        dfd.reject(err);
        return;
      }

      if (!stats || !stats.isFile()) {
        dfd.reject(!!stats ? 'Not a file' : 'Failed to get data on file');
        return;
      }

      getChecksum(filePath)
        .then(function(checksum) {
          var fileData = makeFileData(filePath, stats, checksum);

          dfd.resolve(fileData);
        }, function(err){
          dfd.reject(err);
        });
    });

    return dfd.promise;
  }

  function getChecksum(filePath, callback) {
    var dfd = Q.defer();
    var stream = fs.createReadStream(filePath);
    var hash = crypto.createHash('sha1');
    var finishedOnTime = true;
    var checksumTimeout = setTimeout(function(){
      finishedOnTime = false;
      stream.destroy();
      console.log("Checksum timed out: ", filePath);
    }, 10000);

    hash.setEncoding('hex');
    stream.pipe(hash);
    stream.on('error', function(err) {
      dfd.reject(err);
    });
    stream.on('close', function(){
      if (!finishedOnTime) {
        dfd.resolve(null);
      }
    });
    stream.on('end', function() {
      var sum = null;

      hash.end();

      if (finishedOnTime) {
        clearTimeout(checksumTimeout);
        sum = hash.read();
      }

      dfd.resolve(sum);
    });

    return dfd.promise;
  }

  function makeFileData(filePath, fileStats, checksum) {
    var meta = {
      path: filePath,
      bytes: fileStats.size,
      lastAccessed: fileStats.atime,
      lastModified: fileStats.mtime,
      lastModifiedFileStatus: fileStats.ctime,
      dateCreated: fileStats.birthtime,
      checksum: checksum
    };

    return meta;
  }
}