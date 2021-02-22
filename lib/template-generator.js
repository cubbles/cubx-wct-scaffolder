/**
 * Created by jtrs on 01.06.2016.
 */
'use strict';
(function () {
  const exports = module.exports = {};
  const mustache = require('mustache');
  const fs = require('fs-extra');
  const logger = require('./logger');
  const path = require('path');
  const recursiveReaddirSync = require('recursive-readdir-sync');

  exports.generateWCTFiles = function (webpackagePath, artifactId) {
    const skeletonDir = path.join(__dirname, '../skeletons/test');
    logger.log('debug', 'skeletonDir: ' + skeletonDir);

    const webpackage = path.basename(webpackagePath);
    logger.log('debug', 'webpackage: ' + webpackage);
    if (!path.isAbsolute(webpackagePath)) {
      webpackagePath = path.join(process.cwd(), webpackagePath);
    }
    const artifactPath = path.join(webpackagePath, artifactId);
    if (!fs.exists(artifactPath)) {
      fs.mkdirsSync(artifactPath);
    }

    logger.log('debug', 'artifactPath: ' + artifactPath);

    const dist = path.join(artifactPath, 'test');

    const template = {
      artifactId: artifactId,
      webpackage: webpackage
    };
    let destExists;
    try {
      fs.statSync(dist);
      destExists = true;
    } catch (e) {
      destExists = false;
    }

    if (destExists) {
      throw new Error('The destination folder is already exists: ' + dist + '. Abort the process.');
    } else {
      logger.log('verbose', 'Folder does not exist: ' + dist);
      // proceed in case of an error, as we explicitly want to create the folder
      createFolder(dist, skeletonDir);
    }

    function createFolder (distDir, sourceDir) {
      logger.log('verbose', 'copy template(s) from: ' + sourceDir);
      logger.log('verbose', '                 to: ' + distDir);

      fs.copySync(sourceDir, distDir);

      logger.log('verbose', 'start rendering files in: ' + distDir);
      const files = recursiveReaddirSync(distDir);
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
            fs.unlink(file, function (err) {
              console.error(err);
            });
          }
        }
      });
      logger.log('info', 'finished generation files in: ' + distDir);
    }
  };
}());
