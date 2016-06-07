'use strict';
(function () {
  var exports = module.exports = {};
  var inquirer = require('inquirer');
  var path = require('path');
  var fs = require('fs-extra');
  var logger = require('./logger');
  var _ = require('lodash');

  exports.getArtifactId = function (webpackagePath) {
    var choices = [];
    var manifest;
    if (!path.isAbsolute(webpackagePath)) {
      webpackagePath = path.join(process.cwd(), webpackagePath);
    }
    var manifestPath = path.join(webpackagePath, 'manifest.webpackage');
    logger.log('debug', 'manifest.webpackage path: ' + manifestPath);
    try {
      manifest = fs.readJsonSync(path.join(webpackagePath, 'manifest.webpackage'));

      if (manifest.artifacts.elementaryComponents) {
        _.each(manifest.artifacts.elementaryComponents,
          function (item) {
            choices.push(item.artifactId);
          });
      }
      if (manifest.artifacts.compoundComponents) {
        _.each(manifest.artifacts.compoundComponents,
          function (item) {
            choices.push(item.artifactId);
          });
      }
      logger.log('debug', 'artifacts: ' + choices.toString());
      choices.push('CANCEL');
      return inquirer.prompt(
        [
          {
            type: 'rawlist',
            name: 'artifactId',
            message: 'Please choose the artifact',
            choices: choices
          }
        ]);
    } catch (err) {
      logger.log('error', 'manifest.webpackage not found, or not a valid json.');
      logger.exitAfterFlush(0);
    }
  };
})();
