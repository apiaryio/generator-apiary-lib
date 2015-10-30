
var assert = require('chai').assert;

var add = require('../lib/index').add;


describe('#add', function() {
  it('2 + 2 = 4', function() {
    assert.equal(add(2, 2), 4);
  });

  it('2 + (- 2) = 0', function() {
    assert.equal(add(2, -2), 0);
  });

  it('2 + 0 = 2', function() {
    assert.equal(add(2, 0), 2);
  });
});
