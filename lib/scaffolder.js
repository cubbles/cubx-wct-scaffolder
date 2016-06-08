'use strict';
(function () {
  var generator = require('./templateGenerator');
  var promptArtifact = require('./prompt-artifact');
  var installer = require('./dependency-installer');
  var path = require('path');
  var fs = require('fs');
  var logger = require('./logger');

  var exports = module.exports = {};

  exports.scaffold = function (webpackagePath, callback) {
    if (!path.isAbsolute(webpackagePath)) {
      webpackagePath = path.join(process.cwd(), webpackagePath);
    }
    if (!fs.existsSync(webpackagePath)) {
      logger.log('error', 'The parameter value ' + webpackagePath + ' is not a valid path');
      logger.exitAfterFlush(0);
    } else {
      var prompt = promptArtifact.getArtifactId(webpackagePath);

      prompt.then(function (result) {
        logger.log('debug', 'result: ' + JSON.stringify(result));
        generator.generateWCTFiles(webpackagePath, result.artifactId);
        installer.installDependencies();
        if (callback) {
          callback();
        }
      });
    }
  };
})();
