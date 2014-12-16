var blk = require('../blockutils');

blk.getBlockInfo({"onlyStandard": true}, function(err,json) {
  if (err) {
    console.log("ERROR: " + err);
  } else {
    console.log("OK: " + JSON.stringify(json,null,"  "));
  }
});
