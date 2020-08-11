var should = require('should');
var blockutils = require('../blockutils');
var process = require('process');
var fs = require('fs');

describe('linux-blockutils', function() {
  describe('test breaking exec to create file', function() {
    var fn = `failtest-${process.pid}`;
    before(function(done) {
      if (fs.existsSync(fn)) {
        fs.unlinkSync(fn);
      }

      blockutils.getBlockInfo({"ignoremajor": ["; touch " + fn]}, function(err,json) {
        if (!err) {
          result = json;
        }
        done();
      });
    });

    it('should not create file', function() {
      fs.existsSync(fn).should.equal(false);
    });

    after(function() {
      if (fs.existsSync(fn)) {
        fs.unlinkSync(fn);
      }
    });
  });
});
