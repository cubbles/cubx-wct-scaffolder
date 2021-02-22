'use strict';
(function () {
  const generator = require('./template-generator');
  const promptArtifact = require('./prompt-artifact');

  const path = require('path');
  const fs = require('fs');
  const logger = require('./logger');

  const exports = module.exports = {};

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
        const prompt = promptArtifact.getArtifactId(webpackagePath);

        prompt.then(function (result) {
          if (result.artifactId !== 'CANCEL') {
            try {
              generator.generateWCTFiles(webpackagePath, result.artifactId);
            } catch (err) {
              logger.log('error', err.message);
            }
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
