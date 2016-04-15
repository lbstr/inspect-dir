var fs = require('fs');
var Q = require('q');
var path = require('path');
var FileService = require('./FileService');

module.exports = DirectoryService;

function DirectoryService(directoryPath) {
  var ROOT = directoryPath;
  var fileService = new FileService();

  return {
    getFileNames: getFileNames,
    getFileMeta: getFileMeta
  };

  function getFileNames() {
    var dfd = Q.defer();

    fs.readdir(ROOT, function(err, fileNames) {
      if (err) {
        dfd.reject(err);
      }
      else {
        dfd.resolve(fileNames);
      }
    });

    return dfd.promise;
  }

  function getFileMeta() {
    var promise = getFileNames()
      .then(getFilePaths)
      .then(function(filePaths) {
        return Q.all(filePaths.map(fileService.getMeta));
      });

    return promise;
  }

  function getFilePaths(fileNames) {
    return fileNames.map(function(fileName) {
      return path.join(ROOT, fileName);
    });
  }
}