var fs = require('fs');
var execFile = require('child_process').execFile;
/**
 * blockutils 
 *
 * Returns information on block devices available to the system 
 * in Linux.
 *
 * @author  Matt White <m.w.white@gmail.com>
 *
 */

/**
 * getBlockInfo
 *
 * Creates an array of objects with information about block devices in the 
 * system.  Check if device or mountpoint is currently mounted and return details.
 *
 * @param options   object  options (see below)
 * @param callback  function  this function will be called with the results
 *
 * Valid options:
 *   ignoredev: (string) regexp of devices to ignore (ie. "^sd[ab]" 
 *              would ignore sda and sdb). Default none.
 *   ignoremajor: (array) array of device majors to ignore (ie. [7,11]
 *              would ignore loopback (7) and SCSI cdrom (11) devices
 *              Default to none.
 *   onlyStandard: (boolean) only parse "disk" and "part" entries 
 *              (no lvm, etc).  Default: false
 *   lsblk: (string) full path to lsblk binary.  Defaults to '/bin/lsblk'
 *
 */

exports.getBlockInfo = function(options,callback) {
  // Need to be able to look up a drive's position in the array to
  // be able to add partitions to the drive
  var devMap = {};

  var cmdArgs = ["-bPo", "NAME,KNAME,FSTYPE,LABEL,UUID,RO,RM,MODEL,SIZE,STATE,TYPE" ];

  if (options.ignoredev) {
    var ignoreexp = new RegExp(options.ignoredev);
  }

  // Are we ignoring any dev majors?
  if (options.ignoremajor && (options.ignoremajor.length>0)) {
    cmdArgs.push("--exclude");
    cmdArgs.push(options.ignoremajor);
  }

  // Build the command line
  var cmd = options.lsblk?options.lsblk:"/bin/lsblk"

  // Run it
  var aProc = execFile(cmd, cmdArgs, function(error, stdout, stderr) {
    if (error !== null) {
      // Something went wrong.
      callback(error,null);
      return;
    } else {
      var blockInfo = [];
      // Got it, let's parse the output. Split into lines and iterate...
      var lines = stdout.split('\n');
      for (var i=0; i < lines.length; i++) {
        var cur = lines[i];
        if (cur != '') {
          // Each line should be a series of KEY="value" tokens
          var parsed = cur.match(/[A-Z0-9]+?=".*?"/g);
          var oneDev = {};
          for (var j=0; j<parsed.length; j++) {
            // For each token, break out the key and value
            var keyval = parsed[j].split('=');
            var key = keyval[0];
            var val = keyval[1].replace(/"/g,'');
            oneDev[key] = val;
          }
          // If a device ignore regex was given, test the device name
          if (!options.ignoredev || (!ignoreexp.test(oneDev['NAME']))) {
            // What kind of thing is this?
            switch (oneDev['TYPE']) {
              case 'disk':
                // If it's a disk, add a "PARTITIONS" array
                oneDev['PARTITIONS'] = [];
                devMap[oneDev['NAME']] = blockInfo.length;
                blockInfo[blockInfo.length] = oneDev;
                break;
              case 'part':
                // If this is a partition, add it to the PARTITIONS array in
                // the parent disk's entry
                var dname = oneDev['NAME'].match(/^\D+/);
                if (devMap[dname] !== undefined) {
                  blockInfo[devMap[dname]].PARTITIONS.push(oneDev);
                }
                break;
              default:
                // No special treatment for anything else unless 
                // onlyStandard is set
                if (!options.onlyStandard) {
                  blockInfo[blockInfo.length] = oneDev;
                }
            }
          }
        }
      }
      // Call the callback
      callback(null, blockInfo);
      return;
    }
  });
}
