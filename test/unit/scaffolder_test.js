/*global describe,before, beforeEach, after, afterEach, it, expect*/
'use strict';

var Promise = require('promise');
var sinon = require('sinon');
var scaffolder = require('../../lib/scaffolder');
var path = require('path');
var fs = require('fs-extra');
describe('scaffolder', function () {
  var generator = require('../../lib/template-generator');
  var promptArtifact = require('../../lib/prompt-artifact');
  var installer = require('../../lib/dependency-installer');
  var logger = require('../../lib/logger');
  var testPath;
  var webpackagePath;
  var webpackageName;
  var artifactId;
  
  var getArtifactIdStub;
  var generateWCTFilesStub;
  var installDependenciesStub;
  beforeEach(function () {
    testPath = path.join(process.cwd(), 'test', 'unit');
    webpackageName = 'my-webpackage';
    artifactId = 'my-elementary';
    webpackagePath = path.join(testPath, 'webpackages', webpackageName);
    generateWCTFilesStub = sinon.stub(generator, 'generateWCTFiles', function (webpackagePath, artifactId) {
      // do nothing
    });
    getArtifactIdStub = sinon.stub(promptArtifact, 'getArtifactId', function (webpacakgePath) {
      return new Promise(function (resolve) {
        resolve({
          webpackagePath: webpackagePath,
          artifactId: artifactId
        });
      });
    });
    installDependenciesStub = sinon.stub(installer, 'installDependencies', function () {
      // do nothing
    });
  });
  afterEach(function () {
    generator.generateWCTFiles.restore();
    promptArtifact.getArtifactId.restore();
    installer.installDependencies.restore();
  });

  describe('webpackagePath exists', function () {
    beforeEach(function () {
      fs.mkdirsSync(path.join(webpackagePath));
    });
    afterEach(function () {
      fs.removeSync(path.join(testPath, 'webpackages'));
    });
    describe('webpackagePath is an absolute path', function () {
      beforeEach(function (done) {
        scaffolder.scaffold(webpackagePath, done);
      });
      it('generateWCTFiles should be called once', function () {
        generateWCTFilesStub.should.be.calledOnce;
      });
      it('generateWCTFiles should be called with webpackagaPath and artifactId', function () {
        generateWCTFilesStub.should.be.calledWith(webpackagePath, artifactId);
      });
      it('getArtifactId should be called once', function () {
        getArtifactIdStub.should.be.calledOnce;
      });
      it('getArtifactId should be called with webpackagaPath', function () {
        getArtifactIdStub.should.be.calledWith(webpackagePath);
      });
      it('installDependencies should be called once', function () {
        installDependenciesStub.should.be.calledOnce;
      });
    });
    describe('webpackage path is a relative path', function () {
      beforeEach(function (done) {
        var testRelPath = path.join('test', 'unit');
        var webpackageRelPath = path.join(testRelPath, 'webpackages', webpackageName);
        scaffolder.scaffold(webpackageRelPath, done);
      });
      it('generateWCTFiles called once', function () {
        generateWCTFilesStub.should.be.calledOnce;
      });
      it('generateWCTFiles called with webpackagaPath and artifactId', function () {
        generateWCTFilesStub.should.be.calledWith(webpackagePath, artifactId);
      });
      it('getArtifactId called once', function () {
        getArtifactIdStub.should.be.calledOnce;
      });
      it('getArtifactId called with webpackagaPath', function () {
        getArtifactIdStub.should.be.calledWith(webpackagePath);
      });
      it('installDependencies called once', function () {
        installDependenciesStub.should.be.calledOnce;
      });
    });
  });
  describe('webpackagePath not exists', function () {
    var loggerSpy;
    beforeEach(function (done) {
      loggerSpy = sinon.spy(logger, 'log');
      scaffolder.scaffold(webpackagePath, done);
    });
    afterEach(function () {
      logger.log.restore();
    });
    it('logger.log should be called once', function () {
      loggerSpy.should.be.calledOnce;
    });
    it('generateWCTFiles should be not called', function () {
      generateWCTFilesStub.should.be.not.called;
    });

    it('getArtifactId should be not called', function (done) {
      scaffolder.scaffold(webpackagePath, done);
      getArtifactIdStub.should.be.not.called;
    });

    it('installDependencies should be not called', function (done) {
      scaffolder.scaffold(webpackagePath, done);
      installDependenciesStub.should.be.not.called;
    });

  });
});
