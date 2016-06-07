/* global describe,it, before,after,berforeEach,afterEach */
'use strict';

describe('<{{artifactId}}>', function () {
  this.timeout(7000);
  before(function (done) {
    document.body.addEventListener('cifReady', function () {
      done();
    });
  });

  describe('placeholder for your tests suite', function () {
    it('placeholder for your test', function () {
      // make your test here...
    });
  });
});
