/* global describe, beforeEach,  afterEach, it, expect */
'use strict';

const path = require('path');
const fs = require('fs-extra');
const generator = require('../../lib/template-generator');
describe('template-generator', function () {
  let webpackageName;
  let webpackagePath;
  let testPath;
  let artifactId;
  let artifactPath;
  let generatetTestDir;

  beforeEach(function () {
    webpackageName = 'my-webpackage';
    artifactId = 'my-compound';
    testPath = path.join(process.cwd(), 'test', 'unit');
    webpackagePath = path.join(testPath, 'webpackages', webpackageName);
    artifactPath = path.join(webpackagePath, artifactId);
    generatetTestDir = path.join(artifactPath, 'test');
  });
  afterEach(function () {
    fs.removeSync(path.join(testPath, 'webpackages'));
  });

  describe('generate expected files, if artifact path exists', function () {
    beforeEach(function () {
      fs.mkdirsSync(path.join(webpackagePath, artifactId));
      generator.generateWCTFiles(webpackagePath, artifactId);
    });
    it('subdirectory test should be exist', function () {
      expect(fs.existsSync(generatetTestDir)).to.be.true;
    });
    it('grunt-wct-test-config.js should be exist', function () {
      expect(fs.existsSync(path.join(generatetTestDir, 'grunt-wct-test-config.js'))).to.be.true;
    });
    it('index.html should be exist', function () {
      expect(fs.existsSync(path.join(generatetTestDir, 'index.html'))).to.be.true;
    });
    it('mocha-config.js should be exist', function () {
      expect(fs.existsSync(path.join(generatetTestDir, 'mocha-config.js'))).to.be.true;
    });
    it('<aritfactId>-test.html should be exist', function () {
      expect(fs.existsSync(path.join(generatetTestDir, artifactId + '-test.html'))).to.be.true;
    });
    it('<aritfactId>-test.js should be exist', function () {
      expect(fs.existsSync(path.join(generatetTestDir, artifactId + '-test.js'))).to.be.true;
    });
    it('wct.conf.js should be exist', function () {
      expect(fs.existsSync(path.join(generatetTestDir, 'wct.conf.js'))).to.be.true;
    });
  });
  describe('generate expected files, if artifact path not exists', function () {
    beforeEach(function () {
      fs.mkdirsSync(path.join(webpackagePath));
      generator.generateWCTFiles(webpackagePath, artifactId);
    });
    it('subdirectory test should be exist', function () {
      expect(fs.existsSync(generatetTestDir)).to.be.true;
    });
    it('grunt-wct-test-config.js should be exist', function () {
      expect(fs.existsSync(path.join(generatetTestDir, 'grunt-wct-test-config.js'))).to.be.true;
    });
    it('index.html should be exist', function () {
      expect(fs.existsSync(path.join(generatetTestDir, 'index.html'))).to.be.true;
    });
    it('mocha-config.js should be exist', function () {
      expect(fs.existsSync(path.join(generatetTestDir, 'mocha-config.js'))).to.be.true;
    });
    it('<aritfactId>-test.html should be exist', function () {
      expect(fs.existsSync(path.join(generatetTestDir, artifactId + '-test.html'))).to.be.true;
    });
    it('<aritfactId>-test.js should be exist', function () {
      expect(fs.existsSync(path.join(generatetTestDir, artifactId + '-test.js'))).to.be.true;
    });
    it('wct.conf.js should be exist', function () {
      expect(fs.existsSync(path.join(generatetTestDir, 'wct.conf.js'))).to.be.true;
    });
  });
  describe('should throw an error, if test subdir in artifact path already exists', function () {
    beforeEach(function () {
      fs.mkdirsSync(path.join(webpackagePath, artifactId, 'test'));
    });
    it('error expected', function () {
      expect(function () {
        generator.generateWCTFiles(webpackagePath, artifactId);
      }).to.throw(Error, /The destination folder is already exists/);
    });
  });
});
