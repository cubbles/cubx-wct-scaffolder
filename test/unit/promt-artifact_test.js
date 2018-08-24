/* global describe,before,beforeEach,after,afterEach,it,expect */
'use strict';

var promptArtifact = require('../../lib/prompt-artifact');
var fs = require('fs-extra');
var path = require('path');
var sinon = require('sinon');
var inquirer = require('inquirer');
var Promise = require('promise');
describe('promt-artifact', function () {
  var testPath;
  var webpackagePath;
  var webpackageName;
  var artifactId;
  var manifestWebpackage;

  var manifestPath;
  before(function () {
    testPath = path.join(process.cwd(), 'test', 'unit');
    webpackageName = 'my-webpackage';
    artifactId = 'my-elementary';
    webpackagePath = path.join(testPath, 'webpackages', webpackageName);
    fs.mkdirsSync(path.join(webpackagePath));
    manifestWebpackage = {
      'name': 'my-webpackage',
      'groupId': '',
      'version': '0.1.0-SNAPSHOT',
      'modelVersion': '9.1.0',
      'docType': 'webpackage',
      'author': {
        'name': 'Judit Ross',
        'email': 'judit.ross@incowia.com'
      },
      'license': 'MIT',
      'keywords': [],
      'man': [],
      'artifacts': {
        'elementaryComponents': [
          {
            'artifactId': 'my-elementary',
            'resources': [],
            'dependencies': [],
            'slots': []
          }
        ],
        'compoundComponents': [
          {
            'artifactId': 'my-compound',
            'resources': [],
            'dependencies': [],
            'slots': [],
            'members': [],
            'connections': [],
            'inits': []
          }
        ]
      }
    };
  });

  after(function () {
    fs.removeSync(path.join(testPath, 'webpackages'));
  });

  beforeEach(function () {
    sinon.stub(inquirer, 'prompt').callsFake(function () {
      return new Promise(function (resolve) {
        resolve(artifactId);
      });
    });
    manifestPath = path.join(webpackagePath, 'manifest.webpackage');
  });
  afterEach(function () {
    inquirer.prompt.restore();
  });
  describe('manifest.webpackage exists with elementaries and compounds', function () {
    beforeEach(function () {
      fs.writeJsonSync(manifestPath, manifestWebpackage);
    });
    afterEach(function () {
      fs.unlinkSync(manifestPath);
    });
    it('should be get an Answer with artifactId and webpacakgePath', function (done) {
      promptArtifact.getArtifactId(webpackagePath).then(function (result) {
        result.should.be.equal(artifactId);
        done();
      });
    });
  });
  describe('manifest.webpackage not valid json ', function () {
    beforeEach(function () {
      var badManifest = '{ ,}';
      fs.writeFileSync(manifestPath, badManifest);
    });
    afterEach(function () {
      fs.unlinkSync(manifestPath);
    });
    it('should be get an Answer with artifactId and webpackagePath', function () {
      expect(function () {
        promptArtifact.getArtifactId(webpackagePath);
      }).to.throw(Error, 'manifest.webpackage not found, or not a valid json.');
    });
  });
  describe('manifest.webpackage missed ', function () {
    it('should be get an Answer with artifactId and webpackagePath', function () {
      expect(function () {
        promptArtifact.getArtifactId(webpackagePath);
      }).to.throw(Error, 'manifest.webpackage not found, or not a valid json.');
    });
  });
});
