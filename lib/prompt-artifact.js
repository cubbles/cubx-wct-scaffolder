'use strict';
(function () {
  const exports = module.exports = {};
  const path = require('path');
  const fs = require('fs-extra');
  const inquirer = require('inquirer');
  const logger = require('./logger');
  /**
   * Ask for choose the artifact.
   * For the choiselist collect the artifactIds of elementary and compound components from manifest.webpackage.
   * returns with a Promise of users answer.
   * @param webpackagePath path to the webpackage
   * @returns {*}
   */
  exports.getArtifactId = function (webpackagePath) {
    const choices = [];
    let manifest;
    if (!path.isAbsolute(webpackagePath)) {
      webpackagePath = path.join(process.cwd(), webpackagePath);
    }
    const manifestPath = path.join(webpackagePath, 'manifest.webpackage');
    logger.log('debug', 'manifest.webpackage path: ' + manifestPath);
    try {
      manifest = fs.readJsonSync(path.join(webpackagePath, 'manifest.webpackage'));

      if (manifest.artifacts.elementaryComponents) {
        manifest.artifacts.elementaryComponents.forEach(
          function (item) {
            choices.push(item.artifactId);
          });
      }
      if (manifest.artifacts.compoundComponents) {
        manifest.artifacts.compoundComponents.forEach(
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
            choices: choices,
            pageSize: choices.length
          }
        ]);
    } catch (err) {
      throw new Error('manifest.webpackage not found, or not a valid json.');
    }
  };
})();
