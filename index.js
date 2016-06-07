'use strict';

var scaffolder = require('./lib/scaffolder');
var logger = require('./lib/logger');
var commandLineArgs = require('command-line-args');

var webpackagePath;

var optionDefinitions = [
  { name: 'path', type: String, defaultOption: true },
  { name: 'loglevel', alias: 'l', type: String }
];

var options = commandLineArgs(optionDefinitions);

if (!options.path) {
  logger.log('error', 'Missed necessary parameter \"webpackagePath\". Usage: node index <webpackagPath> [--loglevel <logLevel>]');
  process.exit(0);
} else {
  webpackagePath = options.path;
}

if (options.loglevel && logger.getLevels()[ options.loglevel ]) {
  logger.transports.console.level = options.loglevel;
}

scaffolder.scaffold(webpackagePath);
