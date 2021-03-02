/* globals before, global */
'use strict';

before(function (done) {
  const chai = require('chai');
  chai.should();
  global.expect = chai.expect;
  const sinonChai = require('sinon-chai');
  chai.use(sinonChai);
  done();
});
