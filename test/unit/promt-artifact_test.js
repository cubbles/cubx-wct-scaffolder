/* global describe,before,beforeEach,after,afterEach,it,expect */
'use strict';

const promptArtifact = require('../../lib/prompt-artifact');
const fs = require('fs-extra');
const path = require('path');
const sinon = require('sinon');
const inquirer = require('inquirer');
const Promise = require('promise');
describe('promt-artifact', function () {
  let testPath;
  let webpackagePath;
  let webpackageName;
  let artifactId;
  let manifestWebpackage;

  let manifestPath;
  before(function () {
    testPath = path.join(process.cwd(), 'test', 'unit');
    webpackageName = 'my-webpackage';
    artifactId = 'my-elementary';
    webpackagePath = path.join(testPath, 'webpackages', webpackageName);
    fs.mkdirsSync(path.join(webpackagePath));
    manifestWebpackage = {
      name: 'my-webpackage',
      groupId: '',
      version: '0.1.0-SNAPSHOT',
      modelVersion: '9.1.0',
      docType: 'webpackage',
      author: {
        name: 'Judit Ross',
        email: 'judit.ross@incowia.com'
      },
      license: 'MIT',
      keywords: [],
      man: [],
      artifacts: {
        elementaryComponents: [
          {
            artifactId: 'my-elementary',
            resources: [],
            dependencies: [],
            slots: []
          }
        ],
        compoundComponents: [
          {
            artifactId: 'my-compound',
            resources: [],
            dependencies: [],
            slots: [],
            members: [],
            connections: [],
            inits: []
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
      const badManifest = '{ ,}';
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
