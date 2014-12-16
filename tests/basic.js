var should = require('should');
var blockutils = require('../blockutils');

describe('linux-blockutils', function() {
  describe('getBlockInfo with ignoredev=.*', function() {
    var result;
    before(function(done) {
      blockutils.getBlockInfo({"ignoredev":".*"}, function(err,json) {
        if (!err) {
          result = json;
        }
        done();
      });
    });

    it('should be an empty array', function() {
      result.should.eql([]);
    });
  });

  // This is pretty hard to test as it depends on what devices you have.
  // Assume if it returns something and no error, it's ok
  describe('getBlockInfo with no ignore', function() {
    var result;
    before(function(done) {
      blockutils.getBlockInfo({}, function(err,json) {
        if (!err) {
          result = json;
        }
        done();
      });
    });

    it('should not be an empty array', function() {
      result.length.should.be.greaterThan(0);
    });
  });
});
