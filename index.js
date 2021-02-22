'use strict';

const scaffolder = require('./lib/scaffolder');
const logger = require('./lib/logger');
const commandLineArgs = require('command-line-args');

let webpackagePath;

const optionDefinitions = [
  { name: 'path', type: String, defaultOption: true },
  { name: 'loglevel', alias: 'l', type: String }
];

const options = commandLineArgs(optionDefinitions);

if (!options.path) {
  logger.log('error', 'Missed necessary parameter "webpackagePath". Usage: node index <webpackagPath> [--loglevel <logLevel>]');
  process.exit(0);
} else {
  webpackagePath = options.path;
}

if (options.loglevel && logger.getLevels()[options.loglevel]) {
  logger.transports.console.level = options.loglevel;
}

scaffolder.scaffold(webpackagePath);
