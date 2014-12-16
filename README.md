node-linux-blockutils
=====================

Node.js wrapper for Linux lsblk utility to read information on available block devices

Usage
=====

    var blockutils = require('linux-blockutils');

getBlockInfo(options, callback)
-------------------------------

getBlockInfo parses the output from the util-linux lsblk command and 
returns an array of objects describing the block devices in the system.
Options is an object with zero or more of the following options:

  * ignoredev - (string) regexp of devices to ignore
  * ignoremajor - array of device major numbers to ignore
  * onlyStandard - (boolean) only parse "disk" and "part" entries
  * lsblk - (string) - full path to lsblk binary (defaults to '/bin/lsblk')

Example - get all devices:

    var blk = require('linux-blockutils');

    blk.getBlockInfo({}, function(err,json) {
      if (err) {
        console.log("ERROR:" + err);
      } else {
        console.log(JSON.stringify(json,null,"  "));
      }
    });

Example - ignore sdb, sdc, and loop0:

    var blk = require('linux-blockutils');

    blk.getBlockInfo({"ignoredev":"^(sd[bc]|loop0)"}, function(err,json) {
      if (err) {
        console.log("ERROR:" + err);
      } else {
        console.log(JSON.stringify(json,null,"  "));
      }
    });

Example - ignore all loop and cdrom devices (major #7 and #11):

    var blk = require('linux-blockutils');

    blk.getBlockInfo({"ignoremajor": [7,11]}, function(err,json) {
      if (err) {
        console.log("ERROR:" + err);
      } else {
        console.log(JSON.stringify(json,null,"  "));
      }
    });

