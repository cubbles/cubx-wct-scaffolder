'use strict';
(function () {
  var generator = require('./template-generator');
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
      if (callback) {
        callback();
      }
    } else {
      try {
        var prompt = promptArtifact.getArtifactId(webpackagePath);

        prompt.then(function (result) {
          logger.log('debug', 'result: ' + JSON.stringify(result));
          try {
            generator.generateWCTFiles(webpackagePath, result.artifactId);
            installer.installDependencies();
          } catch (err) {
            logger.log('error', err.message);
          }
          if (callback) {
            callback();
          }
        });
      } catch (err) {
        logger.log('error', err.message);
        if (callback) {
          callback();
        }
      }
    }
  };
})();
