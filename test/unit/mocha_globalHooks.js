/* globals before, global*/
'use strict';

before(function (done) {
  var chai = require('chai');
  chai.should();
  global.expect = chai.expect;
  var sinonChai = require('sinon-chai');
  chai.use(sinonChai);
  done();
});
