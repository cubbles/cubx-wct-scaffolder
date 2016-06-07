'use strict';
(function () {
  var exports = module.exports = {};
  var logger = require('./logger');
  // const exec = require('child_process').execSync;
  const execSync = require('child_process').execSync;
  exports.installDependencies = function () {
    logger.log('info', 'install necessary dependencies');
    var dependencies = [
      'http-proxy-middleware',
      'web-component-tester'
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
