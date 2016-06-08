/**
 * Created by jtrs on 01.06.2016.
 */
'use strict';
(function () {
  var exports = module.exports = {};
  var mustache = require('mustache');
  var fs = require('fs-extra');
  var logger = require('./logger');
  var path = require('path');
  var recursiveReaddirSync = require('recursive-readdir-sync');

  exports.generateWCTFiles = function (webpackagePath, artifactId) {
    var skeletonDir = path.join(__dirname, '../skeletons/test');
    logger.log('debug', 'skeletonDir: ' + skeletonDir);

    var webpackage = path.basename(webpackagePath);
    logger.log('debug', 'webpackage: ' + webpackage);
    if (!path.isAbsolute(webpackagePath)) {
      webpackagePath = path.join(process.cwd(), webpackagePath);
    }
    var artifactPath = path.join(webpackagePath, artifactId);
    if (!fs.exists(artifactPath)) {
      fs.mkdirsSync(artifactPath);
    }

    logger.log('debug', 'artifactPath: ' + artifactPath);

    var dist = path.join(artifactPath, 'test');

    var template = {
      artifactId: artifactId,
      webpackage: webpackage
    };

    try {
      fs.statSync(dist);
      // fail.warn: Grunt will continue processing tasks if the --force command-line option was specified.
      logger.log('error', 'The destination folder already exists: ' + dist + '. Abort the process.');
      // Do not use process.exit directly, because logging to file is async.
      logger.exitAfterFlush(0);
    } catch (e) {
      logger.log('verbose', 'Folder does not exist: ' + dist);
      // proceed in case of an error, as we explicitly want to create the folder
      createFolder(dist, skeletonDir);
    }

    function createFolder (distDir, sourceDir) {
      logger.log('verbose', 'copy template(s) from: ' + sourceDir);
      logger.log('verbose', '                 to: ' + distDir);

      fs.copySync(sourceDir, distDir);

      logger.log('verbose', 'start rendering files in: ' + distDir);
      var files = recursiveReaddirSync(distDir);
      logger.log('debug', 'files', files);
      files.forEach(function (file) {
        logger.log('debug', 'file' + file);
        logger.log('verbose', 'render file: ' + file);
        if (fs.statSync(file).isFile()) {
          fs.writeFileSync(
            mustache.render(file, template),
            mustache.render(
              fs.readFileSync(file, 'utf-8'),
              template
            ),
            'utf-8'
          );
          if (file.match(/(.)*({{)(.)*/)) {
            logger.log('verbose', 'unlink: ' + file);
            fs.unlink(file);
          }
        }
      });
      logger.log('info', 'finished generation files in: ' + distDir);
    };
  };
}());
