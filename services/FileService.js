var fs = require('fs');
var crypto = require('crypto');
var path = require('path');

function FileService(baseDirectory) {
  var ROOT = baseDirectory;

  var getFileNames = function(directoryPath) {
    var files = [];

    try {
      files = fs.readdirSync(directoryPath);
    }
    catch(e) {
      throw 'Unable to read the directory provided: ' + directoryPath;
    }

    return files;
  };

  var getFileStats = function(filePath) {
    try {
      return fs.statSync(filePath);
    }
    catch(e) {
      console.error('Unable to read the file provided: ' + filePath);
      return null;
    }
  };

  var getSha1Checksum = function(filePath) {
    var fileData = fs.readFileSync(filePath);
    var checksum = crypto
      .createHash('sha1')
      .update(fileData, 'utf8')
      .digest('hex');

    return checksum;
  };

  var getFileMeta = function(filePath, fileStats) {
    var sha1 = getSha1Checksum(filePath);

    var meta = {
      path: filePath,
      bytes: fileStats.size,
      lastAccessed: fileStats.atime,
      lastModified: fileStats.mtime,
      lastModifiedFileStatus: fileStats.ctime,
      dateCreated: fileStats.birthtime,
      sha1: sha1
    };

    return meta;
  };

  var getFiles = function(directoryPath) {
    var files = [];
    var fileNames = getFileNames(directoryPath);

    fileNames.forEach(function(fileName) {
      var fullPath = path.join(directoryPath, fileName);
      var stats = getFileStats(fullPath);

      if (stats && stats.isFile()) {
        files.push(getFileMeta(fullPath, stats));
      }
    });

    return files;
  };

  return {
    getAll: function() {
      return getFiles(ROOT);
    }
  }
};

module.exports = FileService;