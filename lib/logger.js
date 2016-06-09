'use strict';
(function () {
  var winston = require('winston');
  var path = require('path');
  var fs = require('fs-extra');
  var logDir = 'log';
  if (!fs.exists(logDir)) {
    fs.mkdirsSync(logDir);
  }
  var logfile = path.join(process.cwd(), logDir, 'log.log');

  var logger = new winston.Logger({
    transports: [
      new (winston.transports.Console)({
        level: 'info',
        colorize: true,
        showLevel: true,
        timestamp: false,
        handleExceptions: true,
        prettyPrint: true
      }),
      new (winston.transports.File)(
        {
          level: 'error',
          filename: logfile,
          maxsize: 5242880,
          maxFiles: 5,
          colorize: false,
          handleExceptions: true,
          timestamp: true,
          json: false
        })
    ],
    exitOnError: false
  });

  logger.exitAfterFlush = function (code) {
    logger.transports.file.on('flush', function () {
      process.exit(code);
    });
  };

  logger.getLevels = function () {
    return winston.config.cli.levels;
  };
  /**
   * configurated winston logger:
   * 1. File logger (in log/log.log)
   * 2. Console logger
   */
  module.exports = logger;
})();
