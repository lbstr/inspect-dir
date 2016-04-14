var fs = require('fs');
var crypto = require('crypto');
var path = require('path');
var Q = require('q');

module.exports = FileService;

function FileService(baseDirectory) {
  var ROOT = baseDirectory;

  return {
    getAll: getAll
  };

  function getAll(success, error) {
    var promise = getFilePaths(ROOT)
      .then(getDataForFiles)
      .then(success)
      .fail(error);

    return promise;
  }

  function getFilePaths(directory) {
    var dfd = Q.defer();

    fs.readdir(directory, function(err, fileNames) {
      if (err) {
        dfd.reject(err);
        return;
      }
      
      var filePaths = fileNames.map(function(fileName) {
        return path.join(directory, fileName);
      });

      dfd.resolve(filePaths);
    });

    return dfd.promise;
  }

  function getDataForFiles(filePaths) {
    var promise = Q.all(filePaths.map(getDataForFile))
      .then(filterOutBadFiles);

    return promise;
  }

  function getDataForFile(filePath) {
    var dfd = Q.defer();

    fs.stat(filePath, function(err, stats) {
      if (err) {
        dfd.reject(err);
        return;
      }

      if (!stats || !stats.isFile()) {
        dfd.resolve(null);
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
    hash.setEncoding('hex');

    var tookTooLong = false;
    var checksumTimeout = setTimeout(function(){
      tookTooLong = true;
      stream.destroy();
    }, 5000);

    stream.pipe(hash);
    stream.on('error', function(err) {
      dfd.reject(err);
    });
    stream.on('close', function(){
      if (tookTooLong) {
        dfd.resolve(null);
      }
    });
    stream.on('end', function() {
      var sum = null;

      hash.end();

      if (!tookTooLong) {
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

  function filterOutBadFiles(files) {
    return files.filter(function(file) {
      return !!file && !!file.checksum;
    });
  }
};