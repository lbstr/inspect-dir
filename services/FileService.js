var fs = require('fs');
var crypto = require('crypto');
var path = require('path');

module.exports = FileService;

function FileService(baseDirectory) {
  var ROOT = baseDirectory;

  return {
    getAll: function() {
      return getFiles(ROOT);
    }
  };

  function getFileNames(directoryPath) {
    var files = [];

    try {
      files = fs.readdirSync(directoryPath);
    }
    catch(e) {
      throw 'Unable to read the directory provided: ' + directoryPath;
    }

    return files;
  }

  function getFileStats(filePath) {
    try {
      return fs.statSync(filePath);
    }
    catch(e) {
      console.error('Unable to read the file provided: ' + filePath);
      return null;
    }
  }

  function getSha1Checksum(filePath) {
    var fileData = fs.readFileSync(filePath);
    var checksum = crypto
      .createHash('sha1')
      .update(fileData, 'utf8')
      .digest('hex');

    return checksum;
  }

  function getFileMeta(filePath, fileStats) {
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
  }

  function getFiles(directoryPath) {
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
  }
};