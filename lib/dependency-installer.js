'use strict';
(function () {
  var exports = module.exports = {};
  var logger = require('./logger');
  // const exec = require('child_process').execSync;
  const execSync = require('child_process').execSync;
  /**
   * install the dependencies: web-component.tester@4.2.2 and http-proxy-middelware@0.15.1
   * via npm install <dependency> --save-dev.
   */
  exports.installDependencies = function () {
    logger.log('info', 'install necessary dependencies');
    var dependencies = [
      'http-proxy-middleware@0.15.1',
      'web-component-tester@4.2.2'
    ];
    logger.log('verbose', 'Going to install the following (dev-)dependencies:');
    logger.log('info', 'Start npm install:');
    dependencies.forEach(function (dependency) {
      logger.log('verbose', 'install ' + dependency);
      execSync('npm install ' + dependency + ' --save-dev', {
        env: process.env,
        stdio: [ process.stdin, process.stdout, process.stderr ]
      });
    });
  };
})();
